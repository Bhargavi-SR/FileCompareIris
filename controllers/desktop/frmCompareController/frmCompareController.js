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
//       pdf: {
//         urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=rwrda3cdhttlw13pmhzelpvm71h15b3e&file_id=f_2095457773355",
//         urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=id0e6fr2zxt2iky0q12yp145wv4x60lt&file_id=f_2095431733227"
//       },
      pdf: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=nvl32rrzmjxidh3fqyhdhmfca0n05v1l&file_id=f_2144117809409",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=tlk6brgwrlmmuqt55dy67zry0mzr81qs&file_id=f_2144114720836"
      },
      xlsx: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=gfx4o64u1wbsh5gaqvk39jhhdehnb8ha&file_id=f_2144117781274",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=1duzc0lcr72avv8akrcwk4adcndj0nlo&file_id=f_2144119720435"
      },
      xls: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=uqjwk09zz9gj031wav6f3n5gk51m3i17&file_id=f_2095403071019",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=73hnszvwlnngjqrjudn7se2px19r8qy6&file_id=f_2095396319754"
      },
      docx: {
        urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=qw82nisgd9saa2dzju0lhm3pyjgp4fqm&file_id=f_2096743062735",
        urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=xpy1xa5z8mokuc27rqhdfomapkzxn76h&file_id=f_2096746970182"
      },
//       doc: {
//         urlA: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=qw82nisgd9saa2dzju0lhm3pyjgp4fqm&file_id=f_2096743062735",
//         urlB: "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=xpy1xa5z8mokuc27rqhdfomapkzxn76h&file_id=f_2096746970182"
//       }
      doc: {
        urlA : "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=0ww0skxtcjrfpfvjw822jx93svvko80f&file_id=f_2130468743975",
        urlB : "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=y2zgbxrngjmagnrnj54e3wfg40x7kj19&file_id=f_2130477254338"
      },
      csv: {
        urlA : "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=bq9pqg2u26oc1dh2ydlr8u6pbkkqwqol&file_id=f_2144682739010",
        urlB : "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=ozghqe0kmxahi5nhb45u999c2pz8h4wa&file_id=f_2144679275882"
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
