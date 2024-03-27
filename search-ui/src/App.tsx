import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch
} from "@elastic/react-search-ui";
import {
  Layout,
  // Sorting
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { SearchDriverOptions } from "@elastic/search-ui";
import './App.css'
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import {SingleSelectFacet} from "@elastic/react-search-ui-views";

function App() {
  const connector = new ElasticsearchAPIConnector({
    host: "http://localhost:9200",
    index: "cv-transcription"
  });

  const config:SearchDriverOptions = {
    alwaysSearchOnInitialLoad: true,
    apiConnector: connector,
    searchQuery: {
      search_fields: {
        generated_text:{},
        text: {},
        age: {},
        accent: {}
      },
      result_fields: {
        text:{ snippet: {} },
        generated_text: { snippet: {} },
        duration: {},
        age: { snippet: {} },
        gender: {},
        accent: { snippet: {} }
      },
      disjunctiveFacets: ["gender", "duration"],
      facets: {
        gender: { type: "value" },
        duration: {
          type: "range",
          ranges: [
            { from : 0, to: 1, name: "0 to 1 minute" },
            { from : 1, to: 2, name: "1 to 2 minutes" },
            { from : 2, to: 3, name: "2 to 3 minutes" },
            { from : 3.1, to: 5, name: "3 to 5 minutes" },
            { from : 5.1, to: 10, name: "5 to 10 minutes" },
            // { from : 10.1, to: 15, name: "10 to 15 minutes" },
            // { from : 15.1, to: 20, name: "15 to 20 minutes" },
            { from : 10.1, name: "Others" }, // to infinity 
          ]
        }
      }
    },
    autocompleteQuery: {
      results: {
        resultsPerPage: 5,
        search_fields: {
          text: {} 
        },
        result_fields: {
          text: { snippet: { size: 100, fallback: true } }, 
          generated_text: { raw: {} } 
        }
      },
      suggestions: {
        types: {
          documents: {
            fields: ["text", "generated_text"] 
          },
          terms: {
            fields: ["text", "generated_text"] 
          }
        },
        size: 4
      }
    }
    
  };

  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox 
                        autocompleteResults={{
                          titleField: "text",
                          urlField: "generated_text",
                          shouldTrackClickThrough: true
                      }}
                        searchAsYouType={true}
                    />
                  }
                  sideContent={
                    <div>
                      <Facet field="gender" label="Gender" view={SingleSelectFacet} />
                      <Facet
                        field="duration"
                        label="Duration"
                        filterType="any"
                      />
                      
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="text"
                    />
                  }
                  bodyHeader={
                    <>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  )
}

export default App
