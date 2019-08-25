package com.hackathon.hackathon;

import androidx.appcompat.app.AppCompatActivity;

import androidx.appcompat.app.ActionBar;
import android.os.Bundle;
import android.view.MenuItem;

public class Alternatives extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.alternative_layout);
        ActionBar actionBar = getSupportActionBar();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeButtonEnabled(true);
    }

    public boolean onOptionsItemSelected(MenuItem item){
        finish();
        return true;
    }
}
