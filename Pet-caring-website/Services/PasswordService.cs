using BCrypt.Net;

namespace Pet_caring_website.Services
{
	public static class PasswordService
	{
		public static string HashPassword(string password)
		{
			return BCrypt.Net.BCrypt.HashPassword(password);
		}

		public static bool VerifyPassword(string password, string hashedPassword)
		{
			return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
		}

        // Helper method to generate a random password
        public static string GenerateRandomPassword(int length = 8)
        {
            var random = new Random();
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
            var password = new char[length];

            for (int i = 0; i < length; i++)
            {
                password[i] = validChars[random.Next(validChars.Length)];
            }

            return new string(password);
        }
    }
}
