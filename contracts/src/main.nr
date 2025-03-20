use dep::aztec::macros::aztec;

#[aztec]
pub contract Nebula {
    use dep::aztec::{
        keys::getters::get_public_keys,
        macros::{functions::{initializer, internal, private, public}, storage::storage},
    };
    use dep::aztec::prelude::{AztecAddress, Map, PublicImmutable, PublicMutable};
    use std::hash::keccak256;

    // #[derive(Serialize)]
    // #[event]
    // struct Transfer {
    //     from: AztecAddress,
    //     to: AztecAddress,
    //     amount: u128,
    // }

    #[storage]
    struct Storage<Context> {
        owner: PublicMutable<AztecAddress, Context>,
        user_address: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        email_lookup: Map<AztecAddress, PublicMutable<Field, Context>, Context>,
        is_registered: Map<AztecAddress, PublicMutable<bool, Context>, Context>,
        // public_balances: Map<AztecAddress, PublicMutable<u128, Context>, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        storage.owner.write(admin);
    }

    //  #[public]
    // #[view]
    // fn balance_of_public(owner: AztecAddress) -> u128 {
    //     storage.public_balances.at(owner).read()
    // }

    // #[public]
    // fn transfer_in_public(from: AztecAddress, to: AztecAddress, amount: u128, nonce: Field) {
    //     if (!from.eq(context.msg_sender())) {
    //         assert_current_call_valid_authwit_public(&mut context, from);
    //     } else {
    //         assert(nonce == 0, "invalid nonce");
    //     }
    //     let from_balance = storage.public_balances.at(from).read().sub(amount);
    //     storage.public_balances.at(from).write(from_balance);
    //     let to_balance = storage.public_balances.at(to).read().add(amount);
    //     storage.public_balances.at(to).write(to_balance);
    // }

    //   #[private]
    // fn transfer_to_public(from: AztecAddress, to: AztecAddress, amount: u128, nonce: Field) {
    //     if (!from.eq(context.msg_sender())) {
    //         assert_current_call_valid_authwit(&mut context, from);
    //     } else {
    //         assert(nonce == 0, "invalid nonce");
    //     }

    //     storage.balances.at(from).sub(from, amount).emit(encode_and_encrypt_note(
    //         &mut context,
    //         from,
    //         from,
    //     ));
    //     Token::at(context.this_address())._increase_public_balance(to, amount).enqueue(&mut context);
    // }

    #[private]
    fn register_user(email_hash: Field, user: AztecAddress) {
        // Safety: Ensure this block is safe and document why
         unsafe {
            let existing_user = get_user_address(email_hash);
            assert(!existing_user.is_zero(), "Email already registered");

            let is_already_registered = check_if_registered(user);
            assert(!is_already_registered, "Address already registered");
        }

        Nebula::at(context.this_address())
            .register_user_public(email_hash, user)
            .enqueue(&mut context); // Verify if `enqueue` is correct
    }

    #[public]
    #[internal]
    fn register_user_public(email_hash: Field, user: AztecAddress) {
        let existing_user = get_user_address(email_hash);
        assert(!existing_user.is_zero(), "Email already registered");

        let is_already_registered = check_if_registered(user);
        assert(!is_already_registered, "Address already registered");

        storage.user_address.at(email_hash).write(user);
        storage.email_lookup.at(user).write(email_hash);
        storage.is_registered.at(user).write(true);
    }

    #[public]
    fn get_user_address(email_hash: Field) -> AztecAddress {
        storage.user_address.at(email_hash).read()
    }

    #[public]
    fn get_user_email(user: AztecAddress) -> Field {
        storage.email_lookup.at(user).read()
    }

    #[public]
    fn check_if_registered(user: AztecAddress) -> bool {
        storage.is_registered.at(user).read()
    }
}
