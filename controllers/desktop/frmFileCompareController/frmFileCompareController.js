define({ 
  
  /* Fetching the input params for file compare service*/
  onCLickCompare: function(){
    var fileType = this.view.txtFileType.text;
    var urlA = "";
    var urlB = "";
    if(fileType !== ""){
      if(fileType === "pdf"){
        urlA = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=rwrda3cdhttlw13pmhzelpvm71h15b3e&file_id=f_2095457773355";
        urlB = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=id0e6fr2zxt2iky0q12yp145wv4x60lt&file_id=f_2095431733227";
      }else if(fileType === "xlsx"){
        urlA = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=uqjwk09zz9gj031wav6f3n5gk51m3i17&file_id=f_2095403071019";
        urlB = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=73hnszvwlnngjqrjudn7se2px19r8qy6&file_id=f_2095396319754";
      }else if(fileType === "docx"){
        //urlA = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=gqjtvdptusfpzj313puiwez1wb6or7im&file_id=f_2095452969360";
        //urlB = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=hepyav2t6wqvdnj3kchj5i0wwukmtqzw&file_id=f_2095419549116";
        urlA = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=qw82nisgd9saa2dzju0lhm3pyjgp4fqm&file_id=f_2096743062735";
        urlB = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=xpy1xa5z8mokuc27rqhdfomapkzxn76h&file_id=f_2096746970182";
      }else{
        alert("Incorrect file type!!")
      }
      voltmx.application.showLoadingScreen(null, "Comparing Policies...", 
                                           constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, null);
      var integrationObj = voltmx.sdk.getCurrentInstance().getIntegrationService("FileCompare");
      var params = {
        "urlA": urlA,
        "urlB": urlB,
        "fileNameA": "."+ fileType,
        "fileNameB": "."+fileType
      };
      integrationObj.invokeOperation("FileCompare", {}, params, 
                                     function(response) {
        voltmx.application.dismissLoadingScreen();
        if (response && response.status === "SUCCESS") {
          this.view.txtFileType.text = "";
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
    }else{
      alert("Please provide file type")
    }
  },
  
  /* Showcase the differences in the segment*/
  updateResultsUI: function(results){
    if (!results || results.length === 0) {
      alert("No differences detected. Policies are identical.");
      this.view.segResults.removeAll();
      return;
    }

    var segmentData = results.map(function(item) {
      return {
        "lblIndex": "Section/Line: " + item.line,
        "lblLineA": { "text": "OLD: " + item.fileA, "skin": "sknLblRedText" },
        "lblLineB": { "text": "NEW: " + item.fileB, "skin": "sknLblGreenText" },
        "lblDiff": ""
      };
    });
    this.view.flxSegResult.isVisible = true;
    this.view.segResults.setData(segmentData);
  }
  

});