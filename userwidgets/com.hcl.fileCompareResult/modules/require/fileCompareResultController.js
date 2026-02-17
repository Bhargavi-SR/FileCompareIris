define({
  constructor: function(baseConfig, layoutConfig, pspConfig) {
    // Properties to store component configuration
    this._serviceName = "";
    this._operationName = "";
    this.view.segCompare.removeAll();
  },

  // Logic to handle component properties (Pass-throughs)
  initGettersSetters: function() {
    // Exposing serviceName property
    defineSetter(this, "serviceName", function(val) {
      this._serviceName = val;
    });
    defineGetter(this, "serviceName", function() {
      return this._serviceName;
    });

    // Exposing operationName property
    defineSetter(this, "operationName", function(val) {
      this._operationName = val;
    });
    defineGetter(this, "operationName", function() {
      return this._operationName;
    });
  },

  /**
     * Public method to be called from the Form
     * @param {Object} fileConfig - Contains urlA, urlB, fileNameA, fileNameB
     */
  compareDocuments: function(fileConfig) {
    // It now uses whatever was sent from the Form or set in the Properties Panel
    var svcName = this._serviceName;
    var opName = this._operationName;
    
    voltmx.application.showLoadingScreen(null, "Comparing Documents...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, null);

    try {
      var client = voltmx.sdk.getCurrentInstance();
      var svc = client.getIntegrationService(svcName);

      svc.invokeOperation(
        opName, 
        {}, 
        fileConfig, 
        this._onCompareSuccess.bind(this), 
        this._onCompareFailure.bind(this)
      );
    } catch (err) {
      voltmx.application.dismissLoadingScreen();
      alert("Service Error: " + err.message);
    }
  },

  _onCompareSuccess: function(response) {
    voltmx.application.dismissLoadingScreen();

    if (!response || response.status !== "SUCCESS") {
      alert("Comparison failed at server.");
      return;
    }
    this._populateSegment(response.diffResults);
  },

  _onCompareFailure: function(error) {
    voltmx.application.dismissLoadingScreen();
    alert("Comparison failed: " + JSON.stringify(error));
  },

  _getSkinByDiffType: function(type) {
    const skins = {
      ADDED: "sknFlxBG378723",    // Green background
      REMOVED: "sknFlxBG9e1023",  // Red background
      MODIFIED: "sknFlxBGeb8038", // Peach/Orange background
      UNCHANGED: "sknFlxPlain"    // Transparent/White
    };
    return skins[type] || "sknFlxPlain";
  },

  _populateSegment: function(results) {
    if (!results || results.length === 0) {
      this.view.segCompare.removeAll();
      return;
    }

    const segData = results.map(item => {
      const skin = this._getSkinByDiffType(item.diffType);
      const isModified = item.diffType === "MODIFIED";

      // If text is empty, provide a newline so the RichText widget maintains height
      const leftData = (item.leftText && item.leftText.trim() !== "") ? item.leftText : "\n";
      const rightData = (item.rightText && item.rightText.trim() !== "") ? item.rightText : "\n";

      return {
        "flxLeft": {
          "skin": (item.diffType === "REMOVED" || isModified) ? skin : "sknFlxPlain"
        },
        "flxRight": {
          "skin": (item.diffType === "ADDED" || isModified) ? skin : "sknFlxPlain"
        },
        // Mapping to RichText widgets
        "rchTxtLeft": { "text": leftData },
        "rchTxtRight": { "text": rightData }
      };
    });

    this.view.flxData.isVisible = true;
    this.view.segCompare.setData(segData);
  }
});