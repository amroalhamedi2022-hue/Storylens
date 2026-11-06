import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.HexFormat;

/** Byte-identical owner-approved golden 1024px icon, no text and no recropping. */
public final class GenerateTextlessLauncher {
    private static final String APPROVED_SHA256="757427720c7e9669aaae1de0f9e86ae67a8c9c6f89bb6e945dd8e2a4e73d38ef";
    public static void main(String[] args) throws Exception {
        Path root=Paths.get("").toAbsolutePath();
        Path source=root.resolve("app/src/main/res/drawable-nodpi/lingua_tales_approved.png");
        Path target=root.resolve("app/src/main/res/drawable-nodpi/lingua_tales_textless.png");
        if(args.length==2){source=Paths.get(args[0]);target=Paths.get(args[1]);}
        byte[] bytes=Files.readAllBytes(source);
        String hash=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        if(!APPROVED_SHA256.equals(hash))
            throw new IllegalArgumentException("Owner golden icon checksum mismatch");
        BufferedImage icon=ImageIO.read(source.toFile());
        if(icon==null||icon.getWidth()!=1024||icon.getHeight()!=1024)
            throw new IllegalArgumentException("Owner golden icon must be 1024x1024 PNG");
        Files.createDirectories(target.toAbsolutePath().getParent());
        Files.copy(source,target,StandardCopyOption.REPLACE_EXISTING);
        System.out.println("Verified and copied owner golden icon byte-for-byte");
    }
}
