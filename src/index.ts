import {
  commands,
  ExtensionContext,
  languages,
  StatusBarAlignment,
  window,
  workspace
} from 'vscode'
import * as path from 'path'
import * as os from 'os'
import * as vscode from 'vscode'

import { CompletionProvider } from './extension/providers/completion'
import { SidebarProvider } from './extension/providers/sidebar'
import {
  delayExecution,
  getTerminal,
  getSanitizedCommitMessage
} from './extension/utils'
import { setContext } from './extension/context'
import {
  EXTENSION_CONTEXT_NAME,
  EXTENSION_NAME,
  EVENT_NAME,
  WEBUI_TABS,
  DEVDOCK_COMMAND_NAME
} from './common/constants'
import { TemplateProvider } from './extension/template-provider'
import { ServerMessage } from './common/types'
import { FileInteractionCache } from './extension/file-interaction'
import { getLineBreakCount } from './webview/utils'
import { auth0Config, socialLogin, handleAuthentication, initWeb3Auth } from './common/auth'

export async function activate(context: ExtensionContext) {
  setContext(context)
  const config = workspace.getConfiguration('devdock')
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Right)
  const templateDir = path.join(os.homedir(), '.devdock/templates') as string
  const templateProvider = new TemplateProvider(templateDir)
  const fileInteractionCache = new FileInteractionCache()

  const completionProvider = new CompletionProvider(
    statusBar,
    fileInteractionCache,
    templateProvider,
    context
  )
  const sidebarProvider = new SidebarProvider(statusBar, context, templateDir)

  templateProvider.init()

  context.subscriptions.push(
    languages.registerInlineCompletionItemProvider(
      { pattern: '**' },
      completionProvider
    ),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.enable, () => {
      statusBar.show()
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.disable, () => {
      statusBar.hide()
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.explain, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      delayExecution(() =>
        sidebarProvider.chatService?.streamTemplateCompletion('explain')
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.addTypes, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      delayExecution(() =>
        sidebarProvider.chatService?.streamTemplateCompletion('add-types')
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.refactor, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      delayExecution(() =>
        sidebarProvider.chatService?.streamTemplateCompletion('refactor')
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.generateDocs, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      delayExecution(() =>
        sidebarProvider.chatService?.streamTemplateCompletion('generate-docs')
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.addTests, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      delayExecution(() =>
        sidebarProvider.chatService?.streamTemplateCompletion('add-tests')
      )
    }),
    commands.registerCommand(
      DEVDOCK_COMMAND_NAME.templateCompletion,
      (template: string) => {
        commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
        delayExecution(() =>
          sidebarProvider.chatService?.streamTemplateCompletion(template)
        )
      }
    ),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.stopGeneration, () => {
      completionProvider.onError()
      sidebarProvider.destroyStream()
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.templates, async () => {
      await vscode.commands.executeCommand(
        'vscode.openFolder',
        vscode.Uri.file(templateDir),
        true
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.githubLogin, async () => {
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockSocialLogin,
        true
      )
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockSetTab,
        value: {
          data: WEBUI_TABS.login
        }
      } as ServerMessage<string>)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.manageProviders, async () => {
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockManageProviders,
        true
      )
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockSetTab,
        value: {
          data: WEBUI_TABS.providers
        }
      } as ServerMessage<string>)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.conversationHistory, async () => {
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockConversationHistory,
        true
      )
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockSetTab,
        value: {
          data: WEBUI_TABS.history
        }
      } as ServerMessage<string>)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.manageTemplates, async () => {
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockManageTemplates,
        true
      )
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockSetTab,
        value: {
          data: WEBUI_TABS.templates
        }
      } as ServerMessage<string>)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.hideBackButton, () => {
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockManageTemplates,
        false
      )
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockConversationHistory,
        false
      )
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockManageProviders,
        false
      )
      commands.executeCommand(
        'setContext',
        EXTENSION_CONTEXT_NAME.devdockSocialLogin,
        false
      )
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.openChat, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.hideBackButton)
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockSetTab,
        value: {
          data: WEBUI_TABS.chat
        }
      } as ServerMessage<string>)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.settings, () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        EXTENSION_NAME
      )
    }),
    commands.registerCommand(
      DEVDOCK_COMMAND_NAME.sendTerminalText,
      async (commitMessage: string) => {
        const terminal = await getTerminal()
        terminal?.sendText(getSanitizedCommitMessage(commitMessage), false)
      }
    ),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.getGitCommitMessage, () => {
      commands.executeCommand(DEVDOCK_COMMAND_NAME.focusSidebar)
      sidebarProvider.conversationHistory?.resetConversation()
      delayExecution(() => sidebarProvider.getGitCommitMessage(), 400)
    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.newChat, () => {
      sidebarProvider.conversationHistory?.resetConversation()
      sidebarProvider.view?.webview.postMessage({
        type: EVENT_NAME.devdockStopGeneration
      } as ServerMessage<string>)

    }),
    commands.registerCommand(DEVDOCK_COMMAND_NAME.githubConnect, () => {
      //initWeb3Auth()
      socialLogin()
    }),

    window.registerWebviewViewProvider('devdock.sidebar', sidebarProvider),
    statusBar
  )

  context.subscriptions.push(vscode.window.registerUriHandler({
    handleUri(uri: vscode.Uri) {
        if (uri.path === '/auth/callback') {
            handleAuthentication(uri).then(() => {
              console.log("Handle Authentication executed successfully")
            })
        }
    }
  }))


  context.subscriptions.push(
    workspace.onDidCloseTextDocument((document) => {
      const filePath = document.uri.fsPath
      fileInteractionCache.endSession()
      fileInteractionCache.delete(filePath)
    }),
    workspace.onDidOpenTextDocument((document) => {
      const filePath = document.uri.fsPath
      fileInteractionCache.startSession(filePath)
      fileInteractionCache.incrementVisits()
    }),
    workspace.onDidChangeTextDocument((e) => {
      const changes = e.contentChanges[0]
      if (!changes) return
      const lastCompletion = completionProvider.lastCompletionText
      const isLastCompltionMultiline = getLineBreakCount(lastCompletion) > 1
      completionProvider.setAcceptedLastCompletion(
        !!(
          changes.text &&
          lastCompletion &&
          changes.text === lastCompletion &&
          isLastCompltionMultiline
        )
      )
      const currentLine = changes.range.start.line
      const currentCharacter = changes.range.start.character
      fileInteractionCache.incrementStrokes(currentLine, currentCharacter)
    })
  )

  window.onDidChangeTextEditorSelection(() => {
    completionProvider.abortCompletion()
    delayExecution(() => {
      completionProvider.setAcceptedLastCompletion(false)
    }, 200)
  })

  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (!event.affectsConfiguration('devdock')) return
      completionProvider.updateConfig()
    })
  )

  if (config.get('enabled')) statusBar.show()
  statusBar.text = '🤖'
}

