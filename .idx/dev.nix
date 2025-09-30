{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.haskellPackages.snap-templates
    pkgs.openssh
    (pkgs.google-cloud-sdk.withExtraComponents [
      pkgs.google-cloud-sdk.components.cloud-datastore-emulator
    ])
  ];
  idx.extensions = [
    "angular.ng-template"
    "google.geminicodeassist"
    "googlecloudtools.cloudcode"
  ];
  idx.previews = {
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
      };
      android = {
        command = [
          "sh"
          "-c"
          "npm i && npx @capacitor/android@5.7.4 && npm i -D @capacitor/cli@5.7.4 && npx cap add android && npx cap sync android && npx cap open android"
        ];
        manager = "process";
      };
    };
  };
}
