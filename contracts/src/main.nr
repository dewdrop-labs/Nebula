use dep::aztec::macros::aztec;

#[aztec]
pub contract Nebula {
    use dep::aztec::{
        macros::{functions::{initializer, private, public, internal}, storage::storage},
    };
    use dep::aztec::prelude::{AztecAddress, Map, PublicImmutable, PublicMutable};


    #[storage]
    struct Storage<Context> {
        owner: PublicMutable<AztecAddress, Context>,
        user_address: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        email_lookup: Map<AztecAddress, PublicMutable<Field, Context>, Context>,
        is_registered: Map<AztecAddress, PublicMutable<bool, Context>, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        storage.owner.write(admin);
    }


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
