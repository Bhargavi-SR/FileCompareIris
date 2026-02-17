define({
  fileA: { base64: null, ext: "" },
  fileB: { base64: null, ext: "" },

  onNavigate: function(){
    this.view.init = this.onFormInit;
    this.view.preShow = this.onPreShow; 
  },

  onFormInit: function() {
    this.view.fileCompareResult.serviceName = "ComparingFilesV1";
    this.view.fileCompareResult.operationName = "Base64SideBySideCompare";
  },
  onPreShow: function(){
    this.view.fileCompareResult.compareResultsUIVis = false;
    this.view.lblFileAStatus.text = "No file selected.";
    this.view.lblFileBStatus.text = "No file selected.";
  },

  onClickCompare: function() {
    if (!this.fileA.base64 || !this.fileB.base64) {
      alert("Please upload both versions of the document.");
      return;
    }
    
    const params = {
      fileA_base64: this.fileA.base64,
      fileB_base64: this.fileB.base64,
      extA: this.fileA.ext,
      extB: this.fileB.ext
    };
    this.view.fileCompareResult.compareDocuments(params);
  },
  
  browseDocument(slot) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt";

    input.onchange = (event) => {
      const [file] = event.target.files; 
      if (file) {
        const fileName = file.name;
        const extension = `.${fileName.split('.').pop().toLowerCase()}`;

        const reader = new FileReader();
        reader.onload = (e) => {
          const [, base64Data] = e.target.result.split(",");

          if (slot === 'A') {
            this.fileA = { base64: base64Data, ext: extension };
            this.view.lblFileAStatus.text = `Selected: ${fileName}`;
          } else {
            this.fileB = { base64: base64Data, ext: extension };
            this.view.lblFileBStatus.text = `Selected: ${fileName}`;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  },

});
