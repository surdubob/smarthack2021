package ro.unibuc.fmi.encryptors;

import java.util.Random;

public class SmarthackPasswordGenerator {

    public String generatePassword(int length, boolean specialCh) {
        String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
        String specialCharacters = "!@#$%&*";
        String numbers = "1234567890";
        String combinedChars;
        if (specialCh) {
            combinedChars = capitalCaseLetters + lowerCaseLetters + specialCharacters + numbers;
        } else {
            combinedChars = capitalCaseLetters + lowerCaseLetters + numbers;
        }

        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            password.append(combinedChars.charAt(random.nextInt(combinedChars.length())));
        }
        return password.toString();
    }
}
