using CryptoHelper;

namespace SG_Backend_api.Engines
{
    public class CryptoEngine : ICryptoEngine
    {
        public string Hash(string text)
        {
            return Crypto.HashPassword(text);
        }

        public bool HashCheck(string hash, string text)
        {
            return Crypto.VerifyHashedPassword(hash, text);
        }
    }
}
