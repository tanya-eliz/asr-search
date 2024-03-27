import { useState } from 'react'
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
  Sorting
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { SearchDriverOptions } from "@elastic/search-ui";
import './App.css'
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

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
        generated_text: {},
        duration: {},
        age: {},
        gender: {},
        accent: {}
      },
      // disjunctiveFacets: ["genre.keyword", "actors.keyword", "directors.keyword"],
      // facets: {
      //   "genre.keyword": { type: "value" },
      //   "actors.keyword": { type: "value" },
      //   "directors.keyword": { type: "value" },
      //   released: {
      //     type: "range",
      //     ranges: [
      //       {
      //         from: "2012-04-07T14:40:04.821Z",
      //         name: "Within the last 10 years"
      //       },
      //       {
      //         from: "1962-04-07T14:40:04.821Z",
      //         to: "2012-04-07T14:40:04.821Z",
      //         name: "10 - 50 years ago"
      //       },
      //       {
      //         to: "1962-04-07T14:40:04.821Z",
      //         name: "More than 50 years ago"
      //       }
      //     ]
      //   },
      //   imdbRating: {
      //     type: "range",
      //     ranges: [
      //       { from: 1, to: 3, name: "Pants" },
      //       { from: 3, to: 6, name: "Mediocre" },
      //       { from: 6, to: 8, name: "Pretty Good" },
      //       { from: 8, to: 10, name: "Excellent" }
      //     ]
      //   }
      // }
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
                      {/* {wasSearched && 
                      <Sorting label={"Sort by"} sortOptions={}  />
                      }
                      <Facet key={"1"} field={"text.keyword"} label={"text"} /> */}
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
