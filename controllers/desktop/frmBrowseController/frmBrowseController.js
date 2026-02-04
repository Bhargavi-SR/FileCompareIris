define({ 
  // Data store for the files
  fileA: { base64: null, ext: "" },
  fileB: { base64: null, ext: "" },

  /**
     * Native Browser File Picker (Failsafe for Desktop Web)
     */
  browseDocument: function(slot) {
    this.view.flxSegResult.isVisible = false;
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt";

    input.onchange = function(event) {
      var file = event.target.files[0];
      if (file) {
        var fileName = file.name;
        var extension = "." + fileName.split('.').pop().toLowerCase();

        var reader = new FileReader();
        reader.onload = function(e) {
          var base64Data = e.target.result.split(",")[1];
          var cleanBase64 = decodeURIComponent(base64Data);
          if (slot === 'A') {
            this.fileA.base64 = base64Data;
            this.fileA.ext = extension;
            this.view.lblFileAStatus.text = "Selected: " + fileName;
          } else {
            this.fileB.base64 = base64Data;
            this.fileB.ext = extension;
            this.view.lblFileBStatus.text = "Selected: " + fileName;
          }
        }.bind(this);
        reader.readAsDataURL(file);
      }
    }.bind(this);

    input.click();
  },

  /**
     * Invoke the Comparison Service
     */
  startComparison: function() {
    if (!this.fileA.base64 || !this.fileB.base64) {
      alert("Please upload both versions of the policy.");
      return;
    }

    voltmx.application.showLoadingScreen(null, "Comparing Policies...", 
                                         constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, null);

    var integrationObj = voltmx.sdk.getCurrentInstance().getIntegrationService("FileCompare");
    var params = {
      "fileA_base64": this.fileA.base64,
      "fileB_base64": this.fileB.base64,
      "extA": this.fileA.ext,
      "extB": this.fileB.ext
    };

    integrationObj.invokeOperation("DeviceBase64", {}, params, 
                                   function(response) {
      voltmx.application.dismissLoadingScreen();
      if (response && response.status === "success") {
        this.updateResultsUI(response.comparisonResults);
      } else {
        alert("Error: " + (response.message || "Unknown error"));
      }
    }.bind(this), 
                                   function(error) {
      voltmx.application.dismissLoadingScreen();
      alert("Connection Error: " + JSON.stringify(error));
    }
                                  );
  },

  /**
     * Map response data to the UI Segment
     */
  updateResultsUI: function(results) {
    if (!results || results.length === 0) {
      alert("No differences detected. Policies are identical.");
      this.view.segResults.removeAll();
      return;
    }

    var segmentData = results.map(function(item) {
      return {
        "lblIndex": "Section/Line: " + item.index,
        "lblLineA": { "text": "OLD: " + item.lineA, "skin": "sknLblRedText" },
        "lblLineB": { "text": "NEW: " + item.lineB, "skin": "sknLblGreenText" },
        "lblDiff": "Analysis: " + item.diff
      };
    });
    this.view.flxSegResult.isVisible = true;
    this.view.segResults.setData(segmentData);
  }
});