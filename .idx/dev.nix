{ pkgs, ... }: {

  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.android-studio
    pkgs.jdk
    pkgs.gradle
    pkgs.firebase-tools
  ];

  # Sets environment variables in the workspace
  env = {
    FIREBASE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6Im9hdXRoL2dvb2dsZToxMDMxMjMzNTQzMzA1NTA0MzkwNzEiLCJhcGlUb2tlblBlcHBlciI6bnVsbCwidmVyc2lvbiI6MywiaWF0IjoxNzU4OTM1NzU3LCJleHAiOjE5MTY3MjM3NTd9.4FhuJrCZzcMnbmHDFuJX286RNzRMUAgsVMJNrdInNbU";
  };

  # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "angular.ng-template"
  ];

  # Enable previews and customize configuration
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
        cwd = "www";
      };
      android = {
        manager = "android";
      };
    };
  };
}
