import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.*;
import java.awt.image.*;
import java.nio.file.*;

/**
 * Derives the textless launcher from the owner's approved ORIGINAL 3D book artwork.
 * No generative replacement, no network, no overwritten source, no text in output.
 * The original's book/petal graphic ends at y=835; all typography is below it.
 * Java 17 source mode: java -Djava.awt.headless=true tools/GenerateTextlessLauncher.java
 */
public final class GenerateTextlessLauncher {
    public static void main(String[] args) throws Exception {
        Path root=Paths.get("").toAbsolutePath();
        Path source=root.resolve("app/src/main/res/drawable-nodpi/lingua_tales_approved.png");
        Path target=root.resolve("app/src/main/res/drawable-nodpi/lingua_tales_textless.png");
        if(args.length==2){source=Paths.get(args[0]);target=Paths.get(args[1]);}
        BufferedImage original=ImageIO.read(source.toFile());
        if(original==null||original.getWidth()<1100||original.getHeight()<1100)
            throw new IllegalArgumentException("Approved original graphic is absent or undersized");
        int n=1024;
        BufferedImage art=new BufferedImage(n,n,BufferedImage.TYPE_INT_ARGB);
        Graphics2D g=art.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
        g.setPaint(new GradientPaint(0,0,new Color(245,243,255),n,n,new Color(201,183,238)));
        g.fill(new RoundRectangle2D.Double(5,5,1014,1014,218,218));
        g.setPaint(new GradientPaint(0,140,new Color(183,195,251,175),1024,780,new Color(249,222,231,115)));
        g.fill(new RoundRectangle2D.Double(13,13,998,998,214,214));
        // The approved ORIGINAL graphic is cropped before any lettering begins.
        BufferedImage panel=new BufferedImage(944,700,BufferedImage.TYPE_INT_ARGB);
        Graphics2D pg=panel.createGraphics();
        pg.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        pg.drawImage(original,0,0,944,700,125,105,1120,835,null);
        pg.dispose();
        for(int y=0;y<panel.getHeight();y++)for(int x=0;x<panel.getWidth();x++){
            int pixel=panel.getRGB(x,y);
            int fade=Math.min(Math.min(x,panel.getWidth()-1-x),Math.min(y,panel.getHeight()-1-y));
            double f=Math.min(1.0,Math.max(0,fade)/45.0);
            f=f*f*(3-2*f);
            int a=(int)Math.round((pixel>>>24)*f);
            panel.setRGB(x,y,(pixel&0x00ffffff)|(a<<24));
        }
        g.drawImage(panel,40,157,null);
        g.setStroke(new BasicStroke(7));
        g.setColor(new Color(204,195,252,188));
        g.draw(new RoundRectangle2D.Double(10,10,1004,1004,209,209));
        g.setStroke(new BasicStroke(2));
        g.setColor(new Color(255,255,255,190));
        g.draw(new RoundRectangle2D.Double(21,21,982,982,196,196));
        g.dispose();
        Files.createDirectories(target.toAbsolutePath().getParent());
        if(!ImageIO.write(art,"png",target.toFile()))
            throw new IllegalStateException("Cannot encode PNG");
        System.out.println("Generated 1024x1024 textless approved launcher");
    }
}
