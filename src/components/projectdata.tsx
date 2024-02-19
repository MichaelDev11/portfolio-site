export const projectsData = [
    {
        title: 'Student Management System',
        description: `
        Utilized C with dynamic memory allocation and linked lists to create
        a student records system which has many different functionalities including:
        creating and removing students, storing student info, backup system into local computer file, and more.
        
        `,
        code: `
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>


#define NAME_LEN 30
#define ID_LEN 5

struct courseGrade {
    char course_name[15];
    char grade[3];  // Increased the size to accommodate grades like 'A+'
    struct courseGrade *next;
};

// Structure of the student and all of its important details
struct student {
    char name[NAME_LEN];
    char id[ID_LEN];
    char year[3];
    double gpa;
    struct courseGrade *course_grades;
    struct student *next;
};

// Prototype function definitions
struct student *add_student(struct student *list);
struct student *add_course_grade(struct student *list);
struct student *remove_student(struct student *list);
struct student *restore(struct student *list);
void print_students(struct student *list);
void print_student_info(struct student *list);
void calculateGpa(struct student *list, const char *sID);
void save_and_exit(struct student *list);
int read_line(char str[], int n);
double grade_to_gpa(const char *grade);

int main() {
    struct student *student_list = NULL;
    student_list = restore(student_list);
    char code;

    printf("Operation List: \n(a) add student, (u) add course and grade, (p) print students, (i) print student info, (r) remove student, (s) save and exit.\n");

    for (;;) {
        printf("Enter operation code: ");
        scanf(" %c", &code);
        while (getchar() != '\n'); 

        switch (code) {
            case 'a':
                student_list = add_student(student_list);
                break;
            case 'u':
                student_list = add_course_grade(student_list);
                break;
            case 'p':
                print_students(student_list);
                break;
            case 'i':
                print_student_info(student_list);
                break;
            case 'r':
                student_list = remove_student(student_list);
                break;
            case 's':
                save_and_exit(student_list);
                return 0;
            default:
                printf("Invalid operation code.\n");
        }

        printf("\n");
    }
}

struct student *restore(struct student *list) {
    FILE *file = fopen("studentdb.txt", "r");

    if (file == NULL) {
        perror("Error opening the restoration file.\n");
        exit(EXIT_FAILURE);
    }

    char line[100];  // Adjust the size according to your data size

    while (fgets(line, sizeof(line), file) != NULL) {
        struct student *r_student = (struct student *)malloc(sizeof(struct student));

        if (r_student == NULL) {
            printf("Memory allocation failed.\n");
            exit(EXIT_FAILURE);
        }

        int result = sscanf(line, "%4s | %29[^|] | %2s | %lf",
                            r_student->id, r_student->name, r_student->year, &r_student->gpa);

        // Check if the end of file or an error occurred
        if (result != 4) {
            printf("Error reading student data from file.\n");
            exit(EXIT_FAILURE);
        }

        r_student->course_grades = NULL; // Initialize course grades

        // Read course and grade information
        while (fgets(line, sizeof(line), file) != NULL && line[0] == '\t') {
            struct courseGrade *new_grade = (struct courseGrade *)malloc(sizeof(struct courseGrade));

            if (new_grade == NULL) {
                printf("Memory allocation failed.\n");
                exit(EXIT_FAILURE);
            }

            result = sscanf(line, "\t%14s %2s\n", new_grade->course_name, new_grade->grade);

            // Check if an error occurred
            if (result != 2) {
                printf("Error reading course grade data from file.\n");
                exit(EXIT_FAILURE);
            }

            new_grade->next = r_student->course_grades;
            r_student->course_grades = new_grade;
        }

        // Add the restored student to the list
        r_student->next = list;
        list = r_student;
    }

    fclose(file);
    return list;
}



struct student *add_student(struct student *list) {
    struct student *new_student = (struct student *)malloc(sizeof(struct student));

    // Allocation failure check
    if (new_student == NULL) {
        printf("Memory allocation failed.\n");
        exit(EXIT_FAILURE);
    }

    printf("Enter Student ID: ");
    read_line(new_student->id, ID_LEN);

    // Check to see if the person we are looking for is at the head of the list
    if (list == NULL || strcmp(new_student->id, list->id) < 0) {
        new_student->next = list;
        list = new_student;
    } else {
        struct student *curr = list;
        while (curr->next != NULL && strcmp(new_student->id, curr->next->id) > 0) {
            curr = curr->next;
        }
        new_student->next = curr->next;
        curr->next = new_student;
    }

    // Grab information
    printf("Enter Student Name: ");
    read_line(new_student->name, NAME_LEN);
    printf("Enter Student Year (F, So, Jr, Sr): ");
    read_line(new_student->year, sizeof(new_student->year));
    new_student->course_grades = NULL;

    return list;
}

struct student *add_course_grade(struct student *list) {
    char id[ID_LEN];

    // Check to see if we have students in db
    if (list == NULL) {
        printf("No students in the database.\n");
        return list;
    }

    printf("Enter Student ID: ");
    read_line(id, ID_LEN);

    struct student *curr = list;
    while (curr != NULL && strcmp(id, curr->id) != 0) {
        curr = curr->next;
    }

    if (curr != NULL) {
        printf("Student Found.\n");
        struct courseGrade *new_grade = (struct courseGrade *)malloc(sizeof(struct courseGrade));

        if (new_grade == NULL) {
            printf("Memory allocation failed.\n");
            exit(EXIT_FAILURE);
        }

        printf("Enter course name: ");
        read_line(new_grade->course_name, sizeof(new_grade->course_name));
        printf("Enter letter grade: ");
        read_line(new_grade->grade, sizeof(new_grade->grade));

        new_grade->next = curr->course_grades;
        curr->course_grades = new_grade;

        calculateGpa(list, id);
    } else {
        printf("Student not found.\n");
    }

    return list;
}

struct student *remove_student(struct student *list) {
    char id[ID_LEN];

    if (list == NULL) {
        printf("Student database is empty.\n");
        return list;
    }

    printf("Enter ID of the student to remove: ");
    read_line(id, ID_LEN);

    struct student *curr = list;
    struct student *prev = NULL;

    if (strcmp(id, curr->id) == 0) {
        list = curr->next;
        free(curr);
        printf("Student removed.\n");
        return list;
    } else {
        while (curr != NULL && strcmp(id, curr->id) != 0) {
            prev = curr;
            curr = curr->next;
        }

        if (curr != NULL) {
            prev->next = curr->next;
            free(curr);
            printf("Student removed.\n");
        } else {
            printf("Student does not exist in the database.\n");
        }
    }

    return list;
}

void print_students(struct student *list) {
    if (list != NULL) {
        struct student *curr = list;

        while (curr != NULL) {
            printf("ID: %s | Name: %s | Year: %s\n", curr->id, curr->name, curr->year);
            curr = curr->next;
        }
    } else {
        printf("Student database is empty.\n");
    }
}

void print_student_info(struct student *list) {
    if (list == NULL) {
        printf("Student database is empty.\n");
        return;
    }

    char id[ID_LEN];
    printf("Enter student ID: ");
    read_line(id, ID_LEN);

    struct student *curr = list;
    while (curr != NULL && strcmp(id, curr->id) != 0) {
        curr = curr->next;
    }

    if (curr != NULL) {
        printf("Student information:\n");
        printf("Name: %s\nStudent ID: %s\nYear: %s\nGPA: %.2f\n", curr->name, curr->id, curr->year, curr->gpa);
        printf("---Course Information---\n");

        struct courseGrade *current_grade = curr->course_grades;
        while (current_grade != NULL) {
            printf("%-15s%-2s\n", current_grade->course_name, current_grade->grade);
            current_grade = current_grade->next;
        }
    } else {
        printf("Student not in database.\n");
    }
}

void calculateGpa(struct student *list, const char *sID) {
    if (list == NULL) {
        printf("Student database is empty.\n");
        return;
    }

    struct student *curr = list;
    while (curr != NULL && strcmp(sID, curr->id) != 0) {
        curr = curr->next;
    }

    if (curr != NULL) {
        double quality_points = 0;
        int total_courses = 0;

        struct courseGrade *current_grade = curr->course_grades;
        while (current_grade != NULL) {
            quality_points += grade_to_gpa(current_grade->grade);
            total_courses++;
            current_grade = current_grade->next;
        }

        if (total_courses > 0) {
            curr->gpa = quality_points / total_courses;
        } else {
            printf("No courses found for GPA calculation.\n");
        }
    } else {
        printf("Student not found.\n");
    }
}

void save_and_exit(struct student *list) {
    printf("Saved information to database.\n");

    const char *filename_o = "studentdb.txt";
    FILE *file = fopen(filename_o, "w");

    if (file == NULL) {
        perror("Error opening file");
        exit(EXIT_FAILURE);
    }

    struct student *curr = list;

    while (curr != NULL) {
        fprintf(file, "%s | %s | %s | %.2f\n",
                curr->id, curr->name, curr->year, curr->gpa);

        struct courseGrade *current_grade = curr->course_grades;
        while (current_grade != NULL) {
            fprintf(file, "\t%s %s\n", current_grade->course_name, current_grade->grade);
            current_grade = current_grade->next;
        }

        fprintf(file, "\n");
        curr = curr->next;
    }

    fclose(file);
}

double grade_to_gpa(const char *grade) {
    switch (toupper(grade[0])) {
        case 'A':
            return 4.0;
        case 'B':
            return 3.0;
        case 'C':
            return 2.0;
        case 'D':
            return 1.0;
        default:
            return 0.0;
    }
}

int read_line(char str[], int n) {
    int ch, i = 0;

    // Skip leading white spaces
    while (isspace(ch = getchar()));

    // Read characters until newline or end of string
    while (ch != '\n' && ch != EOF) {
        // Check if there's space in the buffer
        if (i < n - 1) {
            str[i++] = ch;
        }
        ch = getchar();
    }

    // Null-terminate the string
    str[i] = '\0';

    return i;
} 
    `,
        language: 'c',
        video: 'https://www.youtube.com/embed/_GztP-t5egg'
    },

    {
        title: 'Password Manager Application',
        description: `Created a password manager application that allows a user to create and store passwords on their computer.
        This application used encryption techniques and a user authentication system for retrieving and storing passwords.
        `,
        code:`
// PasswordManager, 2024
// Contributors: MichaelDev11, evelyn-murillo, GitNC6203

// ------- Includes ------------
#include <iostream>
#include <string>
#include <ctime>
#include <cmath>
#include <cctype>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <stdexcept>
#include <conio.h>

using namespace std;
// -----------------------------


// PROTOTYPE Definitions
void clear();
void sign_in();
string encryptPassword(string password);
string decryptPassword(string password);
void generatePassword();
int getShiftValue();
void storePassword(string password, string application);
void loadPassword();
void createFiles();

// Function to clear the terminal
void clear() {
#ifdef _WIN32
    system("cls"); // For Windows
#else
    system("clear"); // For Linux/Mac
#endif
}

void createFiles() {
    // Create userinfo file if it doesn't exist
    ofstream userinfoFile("userinfo.txt", ios::app | ios::out);
    if (!userinfoFile.is_open()) {
        cerr << "Error creating/opening userinfo.txt." << endl;
        return;
    }
    userinfoFile.close();

    // Create passwords file if it doesn't exist
    ofstream passwordsFile("passwords.txt", ios::app | ios::out);
    if (!passwordsFile.is_open()) {
        cerr << "Error creating/opening passwords.txt." << endl;
        return;
    }
    passwordsFile.close();

    // Create secureshift file if it doesn't exist
    ofstream secureshiftFile("secureshift.txt", ios::app | ios::out);
    if (!secureshiftFile.is_open()) {
        cerr << "Error creating/opening secureshift.txt." << endl;
        return;
    }

    // Check if secureshift.txt is empty
    secureshiftFile.seekp(0, ios::end);
    if (secureshiftFile.tellp() == 0) {
        // Add random number to secureshift.txt
        srand(static_cast<unsigned int>(time(0)));
        int randomNumber = rand() % 15;
        secureshiftFile << randomNumber << endl;
    }

    secureshiftFile.close();
}

// Have the user sign in on first time they run the program. If they exist as a user have the user login.
void sign_in() {
    string user;
    string userpass;
    string pass;
    string accountCreated;

    createFiles();

    // Open userinfo file and check for username and password
    ifstream inputFile("userinfo.txt");
    ofstream outputFile("userinfo.txt", ios::app | ios::out);
    

    if (!inputFile.is_open() || !outputFile.is_open()) {
        cerr << "Error opening the file." << endl;
        return;
    }

    getline(inputFile, accountCreated);

    if (accountCreated != "true") {
        clear();

        // Create account
        cout << "Create a login." << endl;
        cout << "Username: ";
        cin >> user;
        cout << "Password: ";
        cin >> userpass;

        // Store account information in the file
        outputFile << "true" << endl;
        outputFile << user << endl;
        outputFile << userpass << endl;

        cout << "\nLogin created." << endl;
        clear();
    }

    inputFile.close();  // Close the file before reopening

    // Open the file again for reading
    inputFile.open("userinfo.txt");

    // Check if the file is opened successfully
    if (!inputFile.is_open()) {
        cerr << "Error opening the file." << endl;
        return;
    }

    // Read username and password from the file
    getline(inputFile, accountCreated);
    getline(inputFile, user);
    getline(inputFile, userpass);

    clear();
    cout << "Welcome to PasswordManager " << user << "!\n";

    do {
        std::cout << "Password: ";
        
        char ch;
        pass = "";
        int i = 0;

        while (1) {
            ch = _getch();

            if (ch == 13) // Enter key
                break;
            else if (ch == 8) { // Backspace key
                if (i > 0) {
                    std::cout << "\b \b"; // Move back, erase character, move back again
                    pass.pop_back();
                    i--;
                }
            } else {
                std::cout << '*';
                pass += ch;
                i++;
            }
        }
        std::cout << std::endl;
    } while (pass != userpass);

    inputFile.close();
}

// Get the value of the shift for the caesar cipher
int getShiftValue() {
    int shift = 0;
    ifstream inputFile("secureshift.txt");

    if (inputFile.is_open()) {
        // Read the shift value from secureshift.txt
        string shiftStr;
        getline(inputFile, shiftStr);
        inputFile.close();

        // Convert the string to an integer
        try {
            shift = stoi(shiftStr);
        } catch (const invalid_argument& e) {
            cerr << "Invalid shift value in secureshift.txt." << endl;
        } catch (const out_of_range& e) {
            cerr << "Shift value in secureshift.txt is out of range." << endl;
        }
    } else {
        cerr << "Error opening secureshift.txt." << endl;
    }

    return shift;
}

// Encrypt the password with caesar cipher
string encryptPassword(string password) {
    int shift = getShiftValue();

    for (char& c : password) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = (c - base + shift) % 26 + base;
        } else if (isdigit(c)) {
            c = (c - '0' + shift) % 10 + '0';
        }
        // You may want to add additional cases for special characters if needed
    }

    return password;
}

// Decrypt the password with caesar cipher
string decryptPassword(string password) {
    int shift = getShiftValue();

    for (char& c : password) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = (c - base - shift + 26) % 26 + base;
        } else if (isdigit(c)) {
            c = (c - '0' - shift + 10) % 10 + '0';
        }
    }

    return password;
}

// Function to generate passwords and then store them in the passwords file
void generatePassword() {
    bool includeSpecialCharacters;
    int passwordLength;
    char enter_own;
    string application;
    string password;

    while (true) {
        cout << "Would you like to enter your own password?\n\t[1] Yes\n\t[2] Generate one\nOption: ";
        cin >> enter_own;

        if (enter_own == '1') {
            cout << "Enter your password: ";
            cin >> password;
            cout << "For which application will it be used for? ";
            cin.ignore(); // Clear newline from the buffer
            getline(cin, application);
            break; // Break out of the loop if '1' is entered
        } else if (enter_own == '2') {
            clear();

            char buffer;

            cout << "Special Characters? (Y/N): ";
            cin >> buffer;
            buffer = tolower(buffer);

            while (buffer != 'y' && buffer != 'n') {
                cout << "Invalid Selection. Please enter 'Y' or 'N': ";
                cin >> buffer;
                buffer = tolower(buffer);
            }

            includeSpecialCharacters = (buffer == 'y');

            cout << "How long would you like your password to be? ";
            while (!(cin >> passwordLength)) {
                // Handle non-numeric input
                cout << "Invalid input. Please enter a numeric value: ";
                cin.clear(); // Clear the error flag
                cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Discard invalid input
            }

            cout << "For which application will it be used for? ";
            cin.ignore(); // Clear newline from the buffer
            getline(cin, application);

            const string charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            const string specialChar = "!@#$%^&*()";  

            srand(time(0));

            const int charsetSize = charset.size();
            const int specialSize = specialChar.size();

            for (int i = 0; i < passwordLength; i++) {
                if (includeSpecialCharacters) {
                    password += (i % 2 == 0) ? charset[rand() % charsetSize] : specialChar[rand() % specialSize];
                } else {
                    password += charset[rand() % charsetSize];
                }
            }
            break;
        } else {
            clear();
            cout << "Invalid Selection. Please enter '1' or '2': ";
        }
    }

    clear();
    cout << "Created password for " << application << ": " << password << endl;
    storePassword(password, application);
}

// Function to store the password and encrypt the file
void storePassword(string password, string application) {
    ofstream outputFile("passwords.txt", ios::app);
    if (!outputFile.is_open()) {
        cerr << "Error opening the passwords file." << endl;
        return;
    }

    password = encryptPassword(password);

    outputFile << password << "\t\t" << application << endl;

    outputFile.close();

    cout << "Password saved successfully." << endl;
}

// Function to print all passwords by decrypting them as they are printed
void loadPassword() {
    ifstream inputFile("passwords.txt");

    if (!inputFile.is_open()) {
        cerr << "Error opening the file." << endl;
        return;
    }

    string encryptedPassword;
    string application;

    clear();
    cout << "---------------Passwords---------------\n" << endl;
    while (inputFile >> encryptedPassword >> application) {
        string decryptedPassword = decryptPassword(encryptedPassword);

        cout << "Application: " << application << "\t\tDecrypted Password: " << decryptedPassword << endl;
    }

    cout << endl;
    inputFile.close();
}

int main() {
    // Sign in
    sign_in();
    clear();
    char gen_or_load;

    // Run main function
    bool create;
    string password;

    cout << "Welcome to your personalized Password Manager" << endl;

    do {
        std::cout << "Please choose: \n\t[1] Create New Password \n\t[2] Load Passwords\nChoice: ";
        std::cin >> gen_or_load;

        switch (gen_or_load) {
            case '1':
                std::cout << "You have chosen to Generate a new password" << endl;
                break;

            case '2':
                std::cout << "You have chosen to Load a password" << endl;
                break;

            default:
                clear();
                std::cout << "Not a valid choice. Please choose again." << endl;
                break;
        }
    } while (gen_or_load != '1' && gen_or_load != '2');

    if (gen_or_load == '1') {

        clear();
        generatePassword();
            
        
        char create;
        bool continueCreating = true;

        while(continueCreating) {
            std::cout << "Would you like to: \n\t[1] Keep Creating Passwords\n\t[2] Save and Exit\n\t[3] Load Password\nChoice: ";
            std::cin >> create;
            create = tolower(create);

            if (create == '1') {
                clear();
                generatePassword(); 
            } else if (create == '2') {
                continueCreating = false;
            } else if (create == '3') {
                clear();
                loadPassword();
            } else {
                clear();
                std::cout << "Invalid input. Please enter a valid option." << endl;
            }
        }

    } else if (gen_or_load == '2') {
        clear();
        loadPassword();
        char create;
        bool continueCreating = true;

        while(continueCreating) {
            std::cout << "Would you like to: \n\t[1] Keep Creating Passwords\n\t[2] Save and Exit\n\t[3] Load Password\nChoice: ";
            std::cin >> create;
            create = tolower(create);

            if (create == '1') {
                clear();
                generatePassword(); 
            } else if (create == '2') {
                continueCreating = false;
            } else if (create == '3') {
                loadPassword();
            } else {
                clear();
                std::cout << "Invalid input. Please choose a valid option" << endl;
            }
        }
    } else {
        cout << "Easter egg ? ravioli ravioli, give me the formuoli";
    }
}
        `,
        language: 'cpp',
        video: 'https://www.youtube.com/embed/wDfYxZohoxI'
    }
];