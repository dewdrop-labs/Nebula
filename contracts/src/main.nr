use dep::aztec::macros::aztec;


#[aztec]
pub contract Nebula{
    use dep::aztec::{
    keys::getters::get_public_keys,
    macros::{functions::{initializer, internal, private, public}, storage::storage},
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
// annotation to mark function as a constructor
fn constructor(admin: AztecAddress) {
    storage.owner.write(admin);
}
     #[private]
    fn register_user_with_email(email_hash: Field) {
        // Check if the email is already registered
        let existing_user = get_user_address(email_hash);
        assert(!existing_user.is_zero(), "Email already registered");

        // Generate a wallet address from the email hash
        let user = generate_wallet_address(email_hash);

        // Call register_user to complete the registration
        Nebula::at(context.this_address())
            .register_user(email_hash, user)
            .enqueue(&mut context);
    }

    #[private]
    fn generate_wallet_address(email_hash: Field) -> AztecAddress {
        let address_bytes = keccak(email_hash.to_bytes()); // Hash the email hash
        let address = AztecAddress::from_bytes(address_bytes); // Convert to AztecAddress
        address
    }

    #[private]
    fn register_user(email_hash: Field, user: AztecAddress) {
        // Check if email is already registered
        unsafe {
        let existing_user = get_user_address(email_hash);
        assert(!existing_user.is_zero(), "Email already registered");

        // Check if address is already registered
        let is_already_registered = check_if_registered(user);
        assert(!is_already_registered, "Address already registered");
        }

        // If checks pass, proceed with registration
        Nebula::at(context.this_address())
            .register_user_public(email_hash, user)
            .enqueue(&mut context);
    }

    #[public]
    #[internal]
    fn register_user_public(email_hash: Field, user: AztecAddress) {
        // Double-check in public function as well for safety
        let existing_user = get_user_address(email_hash);
        assert(!existing_user.is_zero(), "Email already registered");

        let is_already_registered = check_if_registered(user);
        assert(!is_already_registered, "Address already registered");
        

        // Proceed with registration
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