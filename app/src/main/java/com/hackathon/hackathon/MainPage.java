package com.hackathon.hackathon;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.File;
import java.io.OutputStream;
import java.io.FileOutputStream;


public class MainPage extends AppCompatActivity {
    ImageView imageView;
    TextView textView;
    Button btnCam;
    private static final int REQUEST_CAPTURE_IMAGE=1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_page_layout);

        btnCam = (Button)findViewById(R.id.btnCapture);
        imageView = (ImageView)findViewById(R.id.textureView);

        btnCam.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent (MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(intent,REQUEST_CAPTURE_IMAGE);
            }

        });
        File image = new File(AppContext.getAppContext().getFilesDir(), "file.png");
        boolean uploaded = new UploadToS3().s3Upload(image);
        System.out.print(uploaded);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Bitmap bitmap = (Bitmap)data.getExtras().get("data");
        persistImage(bitmap);
        imageView.setImageBitmap(bitmap);
    }

    private void persistImage(Bitmap bitmap) {
        File filesDir = AppContext.getAppContext().getFilesDir();
        File imageFile = new File(filesDir, "image.png");

        OutputStream os;
        try {
            os = new FileOutputStream(imageFile);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, os);
            os.flush();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
