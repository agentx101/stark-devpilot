use contracts::DevDock::{DevDockDispatcher, DevDockDispatcherTrait};
use openzeppelin::tests::utils::constants::OWNER;
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait};
use starknet::ContractAddress;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

#[test]
fn test_deployment_values() {
    let contract_address = deploy_contract("DevDock");

    let dispatcher = DevDockDispatcher { contract_address };
    let supply = dispatcher.pow(2,1);
    assert_eq!(supply == 2,"Power function Not Working" );

    // let current_gretting = dispatcher.gretting();
    // let expected_gretting: ByteArray = "Building Unstoppable Apps!!!";
    // assert_eq!(current_gretting, expected_gretting, "Should have the right message on deploy");

    // let new_greeting: ByteArray = "Learn Scaffold-Stark 2! :)";
    // dispatcher.set_gretting(new_greeting.clone(), 0); // we transfer 0 eth

    // assert_eq!(dispatcher.gretting(), new_greeting, "Should allow setting a new message");
}
