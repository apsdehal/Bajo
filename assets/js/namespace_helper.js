var ns = {  
    init: function() {
        var self = this;
        
        self.rdf_type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
        self.rdf_value = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
        self.rdf_property = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";
        self.rdf_XMLLiteral = "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral";
        
        self.rdfs_label = "http://www.w3.org/2000/01/rdf-schema#label";
        self.rdfs_comment = "http://www.w3.org/2000/01/rdf-schema#comment";
        self.rdfs_resource = "http://www.w3.org/2000/01/rdf-schema#Resource";
        self.rdfs_literal = "http://www.w3.org/2000/01/rdf-schema#Literal";
        self.rdfs_seeAlso = "http://www.w3.org/2000/01/rdf-schema#seeAlso";

        self.wikidataURL = 'http://www.wikidata.org/wiki/Q';
        self.reference_already = "Claim has already a reference with hash"
        
        // Types used to denote a webpage, a text fragment, an image, an annotation
        self.page = "http://schema.org/WebPage";
        self.image = "http://xmlns.com/foaf/0.1/Image";
        //self.image_fragment = "http://purl.org/pundit/ont/fragment-image";
        self.annotation = "http://www.openannotation.org/ns/Annotation";

        self.pundit_annotationId = "http://purl.org/pundit/ont/ao#id";
        self.pundit_annotationDate = "http://purl.org/dc/terms/created";
        self.pundit_authorName = "http://purl.org/dc/elements/1.1/creator";
        self.pundit_userName = "http://xmlns.com/foaf/0.1/name";
        self.pundit_authorURI = "http://purl.org/dc/terms/creator";
        self.pundit_hasTarget = "http://www.openannotation.org/ns/hasTarget";
        self.pundit_hasTag = "http://purl.org/pundit/ont/ao#hasTag";
        self.pundit_hasComment = "http://schema.org/comment";
        self.pundit_isIncludedIn = "http://purl.org/pundit/ont/ao#isIncludedIn";

        self.pundit_VocabCategory = "http://purl.org/pundit/vocab/category";
        
        // Annotation server constants
        self.annotationServer                   = "http://demo-cloud.as.thepund.it:8080/annotationserver/";
        self.annotationServerApi                = self.annotationServer + "api/open/";
        self.annotationServerApiNotebooks       = self.annotationServer + "api/open/notebooks/";
        self.annotationServerApiNotebooksGraph  = self.annotationServer + "api/open/notebooks/graph/";
        self.annotationServerApiUsers       	= self.annotationServer + "api/open/users/";
        self.annotationServerApiCurrentNotebook = self.annotationServer + "api/open/notebooks/current";
        self.annotationServerApiAnnotations     = self.annotationServer + "api/open/annotations/";
        self.annotationServerMetadataSearch     = self.annotationServer + "api/open/annotations/metadata/search";    
        self.annotationServerStorage            = self.annotationServer + "api/open/services/preferences/";
        self.annotationServerVocabProxy         = self.annotationServer + "api/open/services/proxy";
        self.annotationServerUsersCurrent       = self.annotationServer + "api/open/users/current";
        self.annotationServerUsersLogout        = self.annotationServer + "api/open/users/logout";
        self.annotationServerNotebooksActive    = self.annotationServer + "api/open/notebooks/active";
        self.annotationServerApiOwnedNotebooks  = self.annotationServer + "api/open/notebooks/owned";
        self.annotationServerContact            = self.annotationServer + "api/open/services/email";

        //Wikimedia Specific Url for GSoC project
        self.wikimediaServerUsersCurrent = "http://tools.wmflabs.org/wikidata-annotation-tool?action=getcurrentinfo";
        self.wikimediaServerUsersLogout = "http://tools.wmflabs.org/wikidata-annotation-tool?action=logout";
        self.wikimediaServerUsersPush = "http://wikifeeder.local/bajo";


        self.lodLiveURL  = "http://thepund.it/lodlive/app_en.html";

        self.notebooksNamespace = "http://swickynotes.org/notebook/resource/";
        self.usersNamespace = "http://swickynotes.org/notebook/resource/";
        
        

        // RDF predicates used in items to translate to RDF the item's fields.
        // Not present in this list: 
        // .value which contains the full URL
        // .rdfData which can get created by a .createBucketFor* method
        self.items = {
            // Short label (usually 30-40 chars or so)
            label: self.rdfs_label,
            prefLabel: "http://www.w3.org/2004/02/skos/core#prefLabel",
            altLabel: "http://www.w3.org/2004/02/skos/core#altLabel",
            // Long description or content of a text fragment
            description: "http://purl.org/dc/elements/1.1/description",
            // Image contained in the text fragment, or associated with the item
            image: "http://xmlns.com/foaf/0.1/depiction",
            // RDF types of this item
            type: self.rdf_type,
            // Page where this item has been created
            pageContext: "http://purl.org/pundit/ont/ao#hasPageContext",
            isPartOf: "http://purl.org/dc/terms/isPartOf",
            
            // Selector
            selector: "http://www.w3.org/ns/openannotation/core/hasSelector",
            parentItemXP: "http://purl.org/pundit/ont/ao#parentItemXP"
        },
        
        // DEBUG: this has to be moved to each annotator, not in the general conf
        self.fragments = {
            image: "http://purl.org/pundit/ont/ao#fragment-image",
            text: "http://purl.org/pundit/ont/ao#fragment-text",
            named: "http://purl.org/pundit/ont/ao#named-content"
        },
        
        
        self.selectors = {
            polygon: {
                value: "http://purl.org/pundit/ont/ao#selector-polygon",
                label: "Polygonal Selector",
                description: "A polygonal selection described by the coordinates of the its points normalized according to the resource image and width"
            },
            rectangle: {
                vale: "http://purl.org/pundit/ont/ao#selector-rectangle",
                label: "Rectangular Selector",
                description: "A polygonal selection described by the coordinates of the top left vertex, width and height normalized according to the resource image and width"
            }
        }
        
        self.fragmentBaseUri = "http://purl.org/pundit/fragment/";
        self.selectorBaseUri = "http://purl.org/pundit/selector/";
        
        self.notebooks = {
            visibility: 'http://open.vocab.org/terms/visibility',
            created: 'http://purl.org/dc/terms/created',
            creator: 'http://purl.org/dc/terms/creator',
            creatorName: 'http://purl.org/dc/elements/1.1/creator',
            id: 'http://purl.org/pundit/ont/ao#id',
            includes: 'http://purl.org/pundit/ont/ao#includes',
            type: self.rdf_type,
            label: self.rdfs_label
        }
    }
}

ns.init();