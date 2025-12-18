#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// VULNERABLE: Hardcoded credentials
const char* admin_password = "admin123";
const char* debug_key = "debug_key_2024";

// VULNERABLE: Unsafe C functions
void process_can_message(char* message) {
    char buffer[256];
    strcpy(buffer, message);  // Buffer overflow vulnerability
    printf("Processing: %s\n", buffer);
}

// VULNERABLE: Command injection
void execute_diagnostic_command(char* command) {
    char system_command[512];
    sprintf(system_command, "diagnostic %s", command);  // Format string vulnerability
    system(system_command);  // Command injection vulnerability
}

// VULNERABLE: Memory leak
void allocate_memory() {
    char* ptr = malloc(1024);
    // Missing free(ptr) - memory leak
}

// VULNERABLE: Integer overflow
int calculate_checksum(int* data, int length) {
    int sum = 0;
    for (int i = 0; i < length; i++) {
        sum += data[i];  // Potential integer overflow
    }
    return sum;
}

// VULNERABLE: Use after free
void use_after_free_example() {
    char* ptr = malloc(100);
    free(ptr);
    strcpy(ptr, "vulnerable");  // Use after free
}

int main() {
    char input[256];
    printf("ECU Diagnostic Interface\n");
    printf("Enter command: ");
    gets(input);  // Buffer overflow vulnerability
    
    process_can_message(input);
    execute_diagnostic_command(input);
    
    return 0;
}
