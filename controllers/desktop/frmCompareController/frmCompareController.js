define({

  onNavigate: function(){
  	this.view.init = this.onFormInit;
    this.view.preShow = this.onPreShow;
  },
  
  onFormInit: function() {
    this.view.fileCompareResult.serviceName = "ComparingFilesV1";
    this.view.fileCompareResult.operationName = "SideBySideCompare";
  },
  
  onPreShow: function(){
    this.view.fileCompareResult.compareResultsUIVis = false;
  },

  getFileConfig: function (fileType) {
    let configMap = {
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
  
  onClickCompare: function() {
    let fileType = this.view.txtFileType.text;
    if (!fileType) {
      alert("Please enter file type!!");
      return;
    }
    fileType = fileType.toLowerCase();
    let fileConfig = this.getFileConfig(fileType);
    if (!fileConfig) {
      alert("Incorrect file type!!");
      return;
    }
    let params = {
      urlA: fileConfig.urlA,
      urlB: fileConfig.urlB,
      fileNameA: "." + fileType,
      fileNameB: "." + fileType
    };
    this.view.fileCompareResult.compareDocuments(params);
  },

});
