package fr.m2gi.todolist;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.community.tts.TextToSpeech;

// Firebase Emulator Imports
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(GoogleAuth.class);
      add(TextToSpeech.class);
      add(com.getcapacitor.community.facebooklogin.FacebookLogin.class);
    }});

    // Connect to Firebase Emulators if in debug mode
    if (isDebugBuild()) { // You might need to define isDebugBuild() or use BuildConfig.DEBUG
        FirebaseAuth.getInstance().useEmulator("10.0.2.2", 9099);
        FirebaseFirestore.getInstance().useEmulator("10.0.2.2", 8080);
        FirebaseStorage.getInstance().useEmulator("10.0.2.2", 9199);
    }
  }

  // Helper method to check if the app is in debug build
  private boolean isDebugBuild() {
    // Replace with actual logic to check if it's a debug build
    // For example, you can use BuildConfig.DEBUG if it's generated
    return true; // For now, assume it's always debug during development
  }
}
