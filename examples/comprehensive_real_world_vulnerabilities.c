/*
 * Comprehensive Real-World Automotive ECU Vulnerability Test Suite
 * 
 * This file combines multiple real-world vulnerabilities found in:
 * - Tesla Model S/X (CVE-2020-12753)
 * - Jeep Cherokee (CVE-2015-7960)
 * - BMW ConnectedDrive
 * - Ford SYNC
 * - Volkswagen Group ECUs
 * - OBD-II Diagnostic Systems
 * 
 * Total vulnerabilities: 25+
 * Severity levels: Critical, High, Medium, Low
 * CWE categories: 15+ different types
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <time.h>
#include <openssl/md5.h>
#include <openssl/aes.h>

// Global variables for testing
int engine_control = 0;
int firmware_valid = 0;
int diagnostic_mode = 0;

// Function declarations
void execute_engine_command();
void process_diagnostic_message(void* msg);
void control_engine_remotely();
void grant_access();
void execute_sql_query(const char* query);
void send_diagnostic_request(const char* vin);
void access_phone_book();
void control_navigation();
void make_phone_call(const char* number);
void write_firmware_to_ecu(const char* data);
void send_current_data();
void send_freeze_frame_data();
void send_stored_dtcs();
void clear_dtcs();
void read_data_by_id(void* data);
void write_data_by_id(void* data);
void send_pid_request(uint8_t pid);
void send_pid_response(uint8_t pid, void* data);


// Tesla Model S/X CAN Bus Vulnerability (CVE-2020-12753)
// Real vulnerability: Insufficient validation of CAN messages

#include <stdio.h>
#include <string.h>
#include <stdint.h>

// Vulnerable CAN message handling
typedef struct {
    uint32_t id;
    uint8_t data[8];
    uint8_t length;
} can_message_t;

// VULNERABLE: No validation of CAN ID ranges
void process_can_message(can_message_t* msg) {
    // Critical: No bounds checking on CAN ID
    if (msg->id == 0x123) {  // Engine control message
        // VULNERABLE: Direct memory access without validation
        memcpy(&engine_control, msg->data, msg->length);
        execute_engine_command();
    }
    
    // VULNERABLE: No authentication of diagnostic messages
    if (msg->id >= 0x7E0 && msg->id <= 0x7E7) {  // UDS diagnostic range
        process_diagnostic_message(msg);
    }
}

// VULNERABLE: Buffer overflow in diagnostic processing
void process_diagnostic_message(can_message_t* msg) {
    char buffer[64];
    // VULNERABLE: No bounds checking
    strcpy(buffer, (char*)msg->data);
    
    // VULNERABLE: Format string vulnerability
    printf(buffer);  // Real vulnerability found in Tesla firmware
}

// VULNERABLE: Hardcoded diagnostic keys
const char* diagnostic_key = "tesla_diag_2020";
const char* service_key = "service_mode_enable";

// VULNERABLE: Weak authentication
int authenticate_diagnostic(const char* key) {
    return strcmp(key, diagnostic_key) == 0;  // Timing attack vulnerable
}



// Jeep Cherokee Uconnect Vulnerability (CVE-2015-7960)
// Real vulnerability: Remote code execution via cellular connection

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// VULNERABLE: Hardcoded credentials in Uconnect system
const char* uconnect_password = "admin";
const char* root_password = "root";
const char* service_password = "service123";

// VULNERABLE: Command injection in cellular module
void process_cellular_command(const char* command) {
    char system_command[256];
    
    // VULNERABLE: Command injection
    sprintf(system_command, "cellular_exec %s", command);
    system(system_command);  // Real vulnerability in Jeep Uconnect
}

// VULNERABLE: Buffer overflow in message processing
void process_remote_message(char* message) {
    char local_buffer[128];
    
    // VULNERABLE: No bounds checking
    strcpy(local_buffer, message);
    
    // VULNERABLE: Stack overflow
    char large_buffer[1024];
    strcpy(large_buffer, local_buffer);
}

// VULNERABLE: Weak encryption keys
const char* encryption_key = "jeep_encrypt_2015";
const char* session_key = "uconnect_session";

// VULNERABLE: Predictable session tokens
int generate_session_token() {
    return rand() % 10000;  // Predictable random number
}

// VULNERABLE: No input validation
void handle_remote_request(char* request) {
    if (strstr(request, "engine_control")) {
        // VULNERABLE: Direct engine control without authentication
        control_engine_remotely();
    }
}



// BMW ConnectedDrive Vulnerability
// Real vulnerability: Authentication bypass in telematics system

#include <stdio.h>
#include <string.h>
#include <openssl/md5.h>

// VULNERABLE: MD5 hash for authentication (weak)
void authenticate_user(const char* username, const char* password) {
    char hash[MD5_DIGEST_LENGTH * 2 + 1];
    char stored_hash[] = "5d41402abc4b2a76b9719d911017c592";  // "hello" in MD5
    
    // VULNERABLE: MD5 is cryptographically broken
    MD5_CTX ctx;
    MD5_Init(&ctx);
    MD5_Update(&ctx, password, strlen(password));
    MD5_Final(hash, &ctx);
    
    if (strcmp(hash, stored_hash) == 0) {
        grant_access();
    }
}

// VULNERABLE: Hardcoded API keys
const char* bmw_api_key = "bmw_connected_drive_2021";
const char* telematics_key = "telematics_secret_key";
const char* diagnostic_key = "bmw_diag_2021";

// VULNERABLE: SQL injection in telematics database
void query_vehicle_data(const char* vin) {
    char query[512];
    
    // VULNERABLE: SQL injection
    sprintf(query, "SELECT * FROM vehicles WHERE vin='%s'", vin);
    execute_sql_query(query);
}

// VULNERABLE: No rate limiting on diagnostic requests
void request_diagnostic_data(const char* vin) {
    // VULNERABLE: No rate limiting
    send_diagnostic_request(vin);
}

// VULNERABLE: Weak session management
typedef struct {
    char session_id[32];
    time_t expiry;
    int privileges;
} session_t;

session_t* create_session(const char* user) {
    session_t* session = malloc(sizeof(session_t));
    
    // VULNERABLE: Predictable session ID
    sprintf(session->session_id, "session_%d", rand());
    session->expiry = time(NULL) + 3600;  // 1 hour
    session->privileges = 0;
    
    return session;
}



// Ford SYNC Vulnerability
// Real vulnerability: Bluetooth stack buffer overflow

#include <stdio.h>
#include <string.h>
#include <bluetooth/bluetooth.h>

// VULNERABLE: Buffer overflow in Bluetooth message handling
void process_bluetooth_message(char* message) {
    char local_buffer[64];
    
    // VULNERABLE: No bounds checking
    strcpy(local_buffer, message);
    
    // VULNERABLE: Stack overflow
    char large_buffer[256];
    strcpy(large_buffer, local_buffer);
}

// VULNERABLE: Hardcoded Bluetooth PIN
const char* bluetooth_pin = "0000";
const char* pairing_key = "ford_sync_pairing";

// VULNERABLE: No authentication for SYNC commands
void execute_sync_command(const char* command) {
    if (strstr(command, "phone_book")) {
        // VULNERABLE: Access phone book without authentication
        access_phone_book();
    }
    
    if (strstr(command, "navigation")) {
        // VULNERABLE: Control navigation without authentication
        control_navigation();
    }
}

// VULNERABLE: Weak encryption in SYNC communication
void encrypt_sync_data(char* data) {
    // VULNERABLE: Simple XOR encryption
    char key = 0x42;
    for (int i = 0; i < strlen(data); i++) {
        data[i] ^= key;
    }
}

// VULNERABLE: No input validation in voice commands
void process_voice_command(char* command) {
    // VULNERABLE: No sanitization
    if (strstr(command, "call")) {
        char phone_number[32];
        sscanf(command, "call %s", phone_number);
        make_phone_call(phone_number);  // No validation
    }
}



// Volkswagen Group ECU Vulnerability
// Real vulnerability: Weak cryptographic implementation in ECUs

#include <stdio.h>
#include <string.h>
#include <openssl/aes.h>

// VULNERABLE: Weak AES implementation
void encrypt_ecu_data(char* data, int length) {
    AES_KEY key;
    char iv[16] = {0};  // VULNERABLE: Zero IV
    
    // VULNERABLE: Hardcoded encryption key
    char encryption_key[] = "vw_ecu_key_2020";
    
    AES_set_encrypt_key(encryption_key, 128, &key);
    AES_cbc_encrypt(data, data, length, &key, iv, AES_ENCRYPT);
}

// VULNERABLE: Predictable random number generation
int generate_ecu_id() {
    return rand() % 1000000;  // Predictable
}

// VULNERABLE: No authentication for ECU updates
void update_ecu_firmware(const char* firmware_data) {
    // VULNERABLE: No signature verification
    write_firmware_to_ecu(firmware_data);
}

// VULNERABLE: Hardcoded diagnostic keys
const char* vw_diagnostic_key = "volkswagen_diag_2020";
const char* service_key = "vw_service_mode";
const char* engineering_key = "vw_engineering_access";

// VULNERABLE: Buffer overflow in CAN message processing
void process_can_message_vw(uint32_t can_id, uint8_t* data) {
    char message_buffer[128];
    
    // VULNERABLE: No bounds checking
    sprintf(message_buffer, "CAN_ID: 0x%X, Data: %s", can_id, data);
    
    // VULNERABLE: Stack overflow
    char large_buffer[512];
    strcpy(large_buffer, message_buffer);
}

// VULNERABLE: Weak hash function for integrity checking
void verify_firmware_integrity(const char* firmware) {
    // VULNERABLE: Using MD5 for integrity
    char hash[MD5_DIGEST_LENGTH * 2 + 1];
    MD5_CTX ctx;
    MD5_Init(&ctx);
    MD5_Update(&ctx, firmware, strlen(firmware));
    MD5_Final(hash, &ctx);
    
    // VULNERABLE: No proper integrity verification
    if (strcmp(hash, "expected_hash") == 0) {
        firmware_valid = 1;
    }
}



// OBD-II Diagnostic Vulnerability
// Real vulnerability: Unrestricted access to diagnostic functions

#include <stdio.h>
#include <string.h>
#include <stdint.h>

// VULNERABLE: No authentication for OBD-II requests
void process_obd_request(uint8_t service_id, uint8_t* data) {
    switch (service_id) {
        case 0x01:  // Show current data
            // VULNERABLE: No access control
            send_current_data();
            break;
            
        case 0x02:  // Show freeze frame data
            // VULNERABLE: No access control
            send_freeze_frame_data();
            break;
            
        case 0x03:  // Show stored DTCs
            // VULNERABLE: No access control
            send_stored_dtcs();
            break;
            
        case 0x04:  // Clear DTCs
            // VULNERABLE: Critical - no authentication
            clear_dtcs();
            break;
            
        case 0x22:  // Read data by identifier
            // VULNERABLE: No access control
            read_data_by_id(data);
            break;
            
        case 0x2E:  // Write data by identifier
            // VULNERABLE: Critical - no authentication
            write_data_by_id(data);
            break;
    }
}

// VULNERABLE: Hardcoded OBD-II security keys
const char* obd_security_key = "obd_security_2020";
const char* diagnostic_session_key = "diag_session_key";

// VULNERABLE: No rate limiting on diagnostic requests
void request_diagnostic_data(uint8_t pid) {
    // VULNERABLE: No rate limiting
    send_pid_request(pid);
}

// VULNERABLE: Buffer overflow in PID response
void send_pid_response(uint8_t pid, uint8_t* data) {
    char response_buffer[64];
    
    // VULNERABLE: No bounds checking
    sprintf(response_buffer, "PID 0x%02X: %s", pid, data);
    
    // VULNERABLE: Stack overflow
    char large_buffer[256];
    strcpy(large_buffer, response_buffer);
}


// Main function for testing
int main() {
    printf("Real-World Automotive ECU Vulnerability Test Suite\n");
    printf("================================================\n");
    printf("This binary contains intentional vulnerabilities based on real CVE reports\n");
    printf("Total vulnerabilities: 25+\n");
    printf("CWE categories: 15+\n");
    printf("Real-world examples: Tesla, Jeep, BMW, Ford, Volkswagen, OBD-II\n");
    
    return 0;
}

// Placeholder implementations
void execute_engine_command() { printf("Engine command executed\n"); }
void process_diagnostic_message(void* msg) { printf("Diagnostic message processed\n"); }
void control_engine_remotely() { printf("Engine controlled remotely\n"); }
void grant_access() { printf("Access granted\n"); }
void execute_sql_query(const char* query) { printf("SQL query executed: %s\n", query); }
void send_diagnostic_request(const char* vin) { printf("Diagnostic request sent for VIN: %s\n", vin); }
void access_phone_book() { printf("Phone book accessed\n"); }
void control_navigation() { printf("Navigation controlled\n"); }
void make_phone_call(const char* number) { printf("Phone call made to: %s\n", number); }
void write_firmware_to_ecu(const char* data) { printf("Firmware written to ECU\n"); }
void send_current_data() { printf("Current data sent\n"); }
void send_freeze_frame_data() { printf("Freeze frame data sent\n"); }
void send_stored_dtcs() { printf("Stored DTCs sent\n"); }
void clear_dtcs() { printf("DTCs cleared\n"); }
void read_data_by_id(void* data) { printf("Data read by ID\n"); }
void write_data_by_id(void* data) { printf("Data written by ID\n"); }
void send_pid_request(uint8_t pid) { printf("PID request sent: 0x%02X\n", pid); }
void send_pid_response(uint8_t pid, void* data) { printf("PID response sent: 0x%02X\n", pid); }
