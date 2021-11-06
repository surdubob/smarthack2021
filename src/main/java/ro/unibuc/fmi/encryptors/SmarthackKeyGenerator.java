package ro.unibuc.fmi.encryptors;

import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class SmarthackKeyGenerator {

    private String encode(byte[] data) {
        return Base64.getEncoder().encodeToString(data);
    }

    public String generate_aes(int key_size) {
        try {
            javax.crypto.KeyGenerator keyGenerator = javax.crypto.KeyGenerator.getInstance("AES");
            SecureRandom secureRandom = new SecureRandom();
            int keyBitSize = key_size;

            keyGenerator.init(keyBitSize, secureRandom);

            SecretKey secretKey = keyGenerator.generateKey();
            byte[] key = secretKey.getEncoded();
            //            System.out.println(encode(key));
            return encode(key);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String generate_3des() {
        try {
            javax.crypto.KeyGenerator keyGen = javax.crypto.KeyGenerator.getInstance("DESede");
            keyGen.init(168); // key length 112 for two keys, 168 for three keys
            SecretKey secretKey = keyGen.generateKey();
            byte[] key = secretKey.getEncoded();
            //            System.out.println(encode(key));
            return encode(key);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String generate_rsa(int key_size) {
        try {
            Base64.Encoder encoder = Base64.getEncoder();
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
            kpg.initialize(key_size); //1024 or 2048
            KeyPair kp = kpg.generateKeyPair();
            PublicKey pub = kp.getPublic(); //cheie privata
            PrivateKey pvt = kp.getPrivate(); // cheie publica
            byte[] key_pub = pub.getEncoded();
            byte[] key_pvt = pvt.getEncoded();
            //            System.out.println(encode(key_pub));
            //            System.out.println(encode(key_pvt));
            return encode(key_pub) + ";" + encode(key_pvt);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String generate_ecc() {
        try {
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "SunEC");
            ECGenParameterSpec ecsp = new ECGenParameterSpec("secp256r1");
            kpg.initialize(ecsp);
            String key;
            KeyPair kp = kpg.genKeyPair();
            PrivateKey pvt = kp.getPrivate();
            PublicKey pub = kp.getPublic();
            byte[] key_pub = pub.getEncoded();
            byte[] key_pvt = pvt.getEncoded();
            return encode(key_pub) + ";" + encode(key_pvt);
        } catch (InvalidAlgorithmParameterException | NoSuchAlgorithmException | NoSuchProviderException e) {
            e.printStackTrace();
        }
        return null;
    }
}
