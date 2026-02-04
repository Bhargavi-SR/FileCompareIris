define({

  onClickCompare: function () {
    var fileType = this.view.txtFileType.text;

    if (!fileType) {
      alert("Please enter file type");
      return;
    }

    var fileConfig = this.getFileConfig(fileType);

    if (!fileConfig) {
      alert("Incorrect file type!!");
      return;
    }

    voltmx.application.showLoadingScreen(
      null,
      "Comparing documents...",
      constants.LOADING_SCREEN_POSITION_FULL_SCREEN,
      true,
      true,
      null
    );

    var svc = voltmx.sdk.getCurrentInstance()
      .getIntegrationService("ComparingFiles");

    var params = {
      urlA: fileConfig.urlA,
      urlB: fileConfig.urlB,
      fileNameA: "." + fileType,
      fileNameB: "." + fileType
    };

    svc.invokeOperation(
      "SideBySideCompare",
      {},
      params,
      this.onCompareSuccess.bind(this),
      this.onCompareFailure.bind(this)
    );
  },

  /*-----------------------------------*
   * File Configuration Mapping
   *-----------------------------------*/
  getFileConfig: function (fileType) {
    var configMap = {
      pdf: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=rwrda3cdhttlw13pmhzelpvm71h15b3e&file_id=f_2095457773355",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=id0e6fr2zxt2iky0q12yp145wv4x60lt&file_id=f_2095431733227"
      },
      xlsx: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=uqjwk09zz9gj031wav6f3n5gk51m3i17&file_id=f_2095403071019",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=73hnszvwlnngjqrjudn7se2px19r8qy6&file_id=f_2095396319754"
      },
      xls: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=uqjwk09zz9gj031wav6f3n5gk51m3i17&file_id=f_2095403071019",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=73hnszvwlnngjqrjudn7se2px19r8qy6&file_id=f_2095396319754"
      },
      docx: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=qw82nisgd9saa2dzju0lhm3pyjgp4fqm&file_id=f_2096743062735",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=xpy1xa5z8mokuc27rqhdfomapkzxn76h&file_id=f_2096746970182"
      },
      doc: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=qw82nisgd9saa2dzju0lhm3pyjgp4fqm&file_id=f_2096743062735",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=xpy1xa5z8mokuc27rqhdfomapkzxn76h&file_id=f_2096746970182"
      }
    };

    return configMap[fileType];
  },

  /*-----------------------------------*
   * Success Callback
   *-----------------------------------*/
  onCompareSuccess: function (response) {
    voltmx.application.dismissLoadingScreen();

    if (!response || response.status !== "SUCCESS") {
      alert("Comparison failed");
      return;
    }

    this.populateSideBySide(response.diffResults);
  },

  /*-----------------------------------*
   * Failure Callback
   *-----------------------------------*/
  onCompareFailure: function (error) {
    voltmx.application.dismissLoadingScreen();
    alert("Comparison failed: " + JSON.stringify(error));
  },

  /*-----------------------------------*
   * Skin Resolver
   *-----------------------------------*/
  getSkinByDiffType: function (type) {
    switch (type) {
      case "ADDED":
        return "sknDiffAdded";
      case "REMOVED":
        return "sknDiffRemoved";
      case "MODIFIED":
        return "sknDiffModified";
      default:
        return "sknDiffUnchanged";
    }
  },

  /*-----------------------------------*
   * Populate Segment
   *-----------------------------------*/
  populateSideBySide: function (results) {
    var segData = [];

    results.forEach(function (item) {
      var skin = this.getSkinByDiffType(item.diffType);

      segData.push({
        lblLeftText: {
          text: item.leftText || "",
          skin: skin
        },
        lblRightText: {
          text: item.rightText || "",
          skin: skin
        },
        lblMeta: "Page " + item.page + " • Para " + item.paragraph
      });
    }.bind(this));

    this.view.flxBody.isVisible = true;
    this.view.segCompare.setData(segData);
  }

});
