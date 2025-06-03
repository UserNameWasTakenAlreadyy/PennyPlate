# I. Authentication
####Objective: 
Ensure proper validation of email and password, and also check security of JWT token generation, validation and refresh and mechanism.

#### Full authentication work flow
1) Login with correct credentials
2) Get access_token (with refresh token)
3) Use access_token to access encrypted data
4) Wait for access_token expiry, then refresh token to get new access_token


# II. Utilities
#### Objective: 
Ensure only valid JWT token grants access, verify the CRUD operations (test creation, retrieval, listing and deletion of HE-compatible models), check if the params are stored/returned correctly

#### Test cases:
1) Authentication/Authorisation: Check if all endpoints reject requests without a valid Authorisation header.
2) CRUD Operations:
Upload model:
Happy case: Valid params, check if modelID matches input. (Additionally check sad case: any invalid params or missing params)
List models:
Happy case: Check if it returns an array of models (or [ ] if empty)
Get model:
Happy case: Assert 200 OK, result given matches uploaded model
Sad case: Invalid or non-existent ID
Delete Model:
Happy case: Assert 200 OK and verify subsequent get requests return nothing (404)
3) Data integrity:
Test upload -> retrieve ->compare the params and assert no data corruption during storage/retrieval

# III. Single Key Workflow
#### Objective: 
1) Test submission->encryption->analysis -> retrieval of reuslts HE Data flow
2) Verify Keyset Management by ensuring keysets can be created, used and revoked securely.
3) Test ciphertext operations by validating refreshed ciphertext submission/ retrieval.
4) Check task lifecycle by checking that analysis tasks execute correctly with encrypted data.
5) Reject invalid keysets, unauthorised access and malformed data.

#### Test cases:
1) Keyset management
Create keyset:
Happy case: Submit valid keyset params and assert 200 OK, returns keyset_id
Sad case: Invalid scheme
Retrieve keyset:
Assert that it returns exact params used during creation of keyset
Delete keyset: 
Same as before, delete, check for existence, should not exist.

2) Encrypted Data Operations
Submission of data:
Happy case: fields correct, assert 200 ok, returns data_id
Sad case: invalid keyset id
Retrieve data:
Must return original dataLocation and other info

3) Refreshed ciphertext
Submit and retrieve refreshed ciphertext:
Post a refreshed ciphertext, get the ciphertext by ID and verify contents, get all ciphertexts and verify new entry appears
Same for deletion of an existing ciphertext.

4) Task Management
Create and monitor analysis task (Happy Case):
Submit encrypted data, post a new analysis task referencing the data, get task by ID and verify initial status, then poll task until completion and verify final results
Same for deletion of a task as all previous deletion testing.
Create task with invalid data: Attempt to post task with non-existent data ID for eg., verify appropriate error response

# IV. Multi-Party Workflow
#### Objective: 
1) Verify multi-party key generation (Round 1 and Round 2 workflows).
2) Test encrypted data submission and management (CRUD operations).
3) Validate multi-stage analysis tasks (initialization, continuation, result decryption).
4) Check refreshed ciphertext handling.
5) Test error cases (invalid key shares, missing dependencies, unauthorized operations).
6) Verify task status tracking (partial decryption, finalization).
7) Ensure data consistency across all parties.

#### Test cases:
1) Multi-party key generation
Happy case: 
Complete successful key generation by initialising process -> submit rd 1 shares -> finalise rd 1 -> submit rd 2 shares -> finalise rd 2 -> verfiy keyset (using the get HE keysets)
Sad case:
Insufficient shares in round 1, out of order operations (attempt rd 2 before rd 1), or just invalid format

2) Encrypted data management
Happy case:
Submit encrypted data -> verify submissions -> verify the contents of list -> delete and check successful deletion (CRUD Operations)
Sad case:
Data submission with invalid keyset, unauthorised data deletion

3) Refreshed ciphertext operations
Happy case: 
Submit original data -> post a new "refreshed" set of data -> verify that changes have been made after a refresh
Sad case:
Refresh data expired/does not exist (Attempting to refresh on deleted data)

4) Analysis of task workflow
Happy case:
Submit analysis task -> monitor progress using status(get task_id) -> advance stage for multi-stage using continue -> for encrypted result, initialise decryption process -> go through multiple partial decryptions -> finalise decryption
Sad case:
Task with missing dependencies (Submit task before data exists), Premature finalisation (call decryption finalisation process too early)


# V. Key Generation
#### Objective: 
1) Verify secure multi-party key generation protocol
2) Validate single-key key management operations
3) Test coordination between distributed parties
4) Ensure proper error handling in cryptographic operations

#### Test cases:
1) Multi Party Key Generation
Happy case: Initialisation -> returns session ID -> rd 1, all parties share and coordiantor will finalise -> round 2, repeat from rd 1 process -> verify by getting new HE keys and show details
Sad cases: 
Wrong order of finalisation (rd 2 before rd 1), invalid key share, duplicate key share, unauthorised finalisation (non-coordinator tries to finalise)

2) Single Key Operations
Happy case: Create keys -> retrieve -> list out ->delete (test for these CRUD operations)
Sad cases: Duplicate creation, deletiong of non-existent keys, use deleted keyset

# VI. Data Encryption
#### Objective:
1) Validate encrypted data submission and storage
2) Test ciphertext refresh functionality
3) Verify proper access controls between parties
4) Ensure data integrity throughout lifecycle
5) Test recovery from failed encryption attempts

#### Test cases:
1) Multi-party data
Happy case: Submit -> refresh -> list -> delete
Sad cases: invalid keysets, cross-party deletion (other party can access and delete data that is not theirs), refreshed deleted data

2) Single Key Data
Happy case: Post -> Get -> Post -> Delete
Sad cases: Data too large, invalid metadata (invalid/ missing required fields)

# VII. Computation
#### Objective: 
1) Verify distributed computation workflow
2) Test multi-stage task progression
3) Validate task status tracking
4) Ensure proper computation isolation
5) Test error recovery in partial computations

#### Test cases:
1) Multi-Party Tasks
Happy cases: 
Post task -> show progress -> advance state properly
Check for completion satus (all parties agree to call continue)
Sad cases: missing data, unauthorised continue, early status check (before anything has been initialised)

2) Single Key Tasks
Happy case: Post -> Get to show progress -> check deletion
Sad cases: Invalid parameters (bad task request), duplicate requests on the task (double delete etc)

# VIII. Data Decryption
#### Objective: 
1) Validate secure multi-party decryption protocol
2) Test partial result aggregation
3) Verify final plaintext correctness
4 ) Ensure proper access controls during decryption
5) Test recovery from failed decryption attempts

#### Test cases:
Happy cases: 
Distributed decryption by first initialising -> each party post their ciphertext result, coordinator finalise the decryption process
Final output matches expected plaintext

Sad cases:
partial participation in decryption, invalid ciphertext (from partial results), finalised before all shares present

