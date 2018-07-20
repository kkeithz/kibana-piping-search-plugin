import React from "react";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiLink,
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiFilePicker
} from "@elastic/eui";
import { Display } from "../display/display";
import datemath from '@kbn/datemath'
import { Table } from "../display/table";
import Service from '../../services/service';

export class Lookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lookupData: [],
      selectedLookup: null,
      selectedLookupData: null,
      isOpenCreateModal: false,
      createLookupName: '',
      createLookupFileContent: null,
      createLookupNameError: null,
      createLookupFileContentError: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.load();
  }
  load(){
    //call get lookup
    Service.getInstance().lookup()
    .then((data)=>{
      this.setState({
        lookupData: data.results,
      });  
    });
  }
  loadSelectedLookup(lookup){
    if(lookup != null){
      //call get lookup data
      Service.getInstance().lookupData(lookup)
      .then((data)=>{
        this.setState({
          selectedLookup: lookup,
          selectedLookupData: data.results,
        });
      });
    }else{
      this.setState({
        selectedLookup: null,
        selectedLookupData: null,
      });
    }
  }
  delete(lookup){
    //call delete
    Service.getInstance().deleteLookup(lookup)
    .then((result)=>{
      if(lookup == this.state.selectedLookup){
        this.loadSelectedLookup(null);
      }
      this.load();
    });
  }
  onSelectedLookup(lookup){
    this.loadSelectedLookup(lookup);
  }
  onDelete(lookup){
    this.delete(lookup);
  }
  onOpenCreateModal(){
    this.setState({
      isOpenCreateModal: true,
      createLookupName: '',
      createLookupFileContent: null,
      createLookupNameError: null,
      createLookupFileContentError: null,
      isLoading: false,
    });
  }
  onCloseCreateModal(){
    this.setState({
      isOpenCreateModal: false,
    });
  }
  onCreateLookup(){
    var createLookupNameError = null;
    var createLookupFileContentError = null;
    //validate
    if(this.state.createLookupName == null || this.state.createLookupName == ''){
      createLookupNameError = 'Please provide lookup name';
    }
    if(this.state.createLookupFileContent == null || this.state.createLookupFileContent == ''){
      createLookupFileContentError = 'Please upload CSV file';
    }

    this.setState({
      createLookupNameError: createLookupNameError,
      createLookupFileContentError: createLookupFileContentError,
    })

    if(createLookupNameError == null && createLookupFileContentError == null){
      //create lookup
      this.setState({
        isLoading: true
      });
      Service.getInstance().createLookup(this.state.createLookupName, this.state.createLookupFileContent)
      .then((result)=>{
        //close if ok
        this.onCloseCreateModal();
        //load new lookup list
        this.load();
      });
    }
  }
  onCreateLookupNameChange(e){
    this.setState({
      createLookupName: e.target.value
    });
  }
  onFilePickerChange(files){
    var reader  = new FileReader();
    reader.addEventListener("load", ()=>{
      this.setState({
        createLookupFileContent: reader.result,
      });
    }, false);
    if (files[0]) {
      reader.readAsText(files[0]);
    }
  }
  render() {
    let modal;
    if (this.state.isOpenCreateModal) {
      modal = (
        <EuiOverlayMask>
          <EuiModal onClose={this.onCloseCreateModal.bind(this)} style={{ width: '800px' }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle >
                Create new lookup
              </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
            <EuiForm>
              <EuiFormRow 
                label="Lookup name" 
                isInvalid={this.state.createLookupNameError}
                error={[this.state.createLookupNameError]}>
                <EuiFieldText 
                  value={this.state.createLookupName} 
                  onChange={this.onCreateLookupNameChange.bind(this)} 
                  isInvalid={this.state.createLookupNameError}
                  />
              </EuiFormRow>
              <EuiFormRow 
                label="CSV File Upload" 
                isInvalid={this.state.createLookupFileContentError}
                error={[this.state.createLookupFileContentError]}>
                <EuiFilePicker 
                  onChange={this.onFilePickerChange.bind(this)} 
                />
              </EuiFormRow>
            </EuiForm>
            </EuiModalBody>
            <EuiModalFooter>
              <EuiButtonEmpty onClick={this.onCloseCreateModal.bind(this)}>
                Cancel
              </EuiButtonEmpty>
              <EuiButton onClick={this.onCreateLookup.bind(this)} fill isLoading={this.state.isLoading}>
                Save
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }
    return (
      <div>
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiText>
                      <h3>Lookup Table</h3>
                    </EuiText>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={this.onOpenCreateModal.bind(this)}>Create new lookup</EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <Table 
                  data={this.state.lookupData} 
                  columns={
                    [
                      {
                        field: 'name',
                        name: 'Name',
                        sortable: true,
                        hideForMobile: false,
                        render: (name) => (
                          <EuiLink onClick={this.onSelectedLookup.bind(this, name)}>
                            {name}
                          </EuiLink>
                        )
                      },
                      {
                        field: 'columns',
                        name: 'Columns',
                        sortable: true,
                        hideForMobile: false,
                      },
                      {
                        field: 'count',
                        name: 'Count',
                        sortable: true,
                        hideForMobile: false,
                      },
                      {
                        field: 'upload_date',
                        name: 'Upload Date',
                        sortable: true,
                        hideForMobile: false,
                      },
                      {
                        name: 'Actions',
                        actions: [{
                          name: 'Delete',
                          icon: 'trash',
                          color: 'danger',
                          type: 'icon',
                          onClick: (item)=>{ this.onDelete(item.name); }
                        }]
                      }
                    ]
                  }
                  limit={10} />
                <EuiSpacer />
                {
                  (this.state.selectedLookup != null)?
                  <div>
                    <EuiText grow={false}>
                      <h3>{this.state.selectedLookup}</h3>
                    </EuiText>
                    <Table data={this.state.selectedLookupData} />
                  </div>
                  :null
                }
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
        {modal}
      </div>
    );
  }
  
};
