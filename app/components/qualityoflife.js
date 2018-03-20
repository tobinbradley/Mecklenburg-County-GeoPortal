import jsonToURL from "../js/jsontourl";
import Chartist from "chartist";
import naturalSort from "../js/naturalsort";
import abbrNumber from "../js/abbreviatenumber";
import distChart from "./qol-distchart";

let template = `
    <div>
        <div class="qol">
            <div class="text-center">
                <div class="report-record-highlight">
                    <svg class="icon icon-quality-of-life"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-quality-of-life"></use></svg>
                    <h1> Quality of Life</h1>
                </div>
            </div>
            <div>
              <!-- tabs -->
                <div>
                    <div>
                        <div class="tabs no-print">
                            <div class="tabs-bar">
                                <button class="tab" v-bind:class="{tabActive: activeTab === 'economics'}" v-on:click="activeTab = 'economics'">Money</button>
                                <button class="tab" v-bind:class="{tabActive: activeTab === 'demographics'}" v-on:click="activeTab = 'demographics'">People</button>
                                <button class="tab" v-bind:class="{tabActive: activeTab === 'environment'}" v-on:click="activeTab = 'environment'">Planet</button>
                                <button class="tab" v-bind:class="{tabActive: activeTab === 'health'}" v-on:click="activeTab = 'health'">Health</button>
                            </div>
                            <div id="economics" v-show="activeTab === 'economics'">
                                <p>
                                    <button type="button" class="chip" data-metric="19" v-on:click="selectMetric(19, $event)">
                                      Commercial Construction
                                  </button>
                                    <button type="button" class="chip" data-metric="41" v-on:click="selectMetric(41, $event)">
                                      Commercial Space
                                  </button>
                                    <button type="button" class="chip" data-metric="38" v-on:click="selectMetric(38, $event)">
                                      Employment
                                  </button>
                                    <button type="button" class="chip" data-metric="80" v-on:click="selectMetric(80, $event)">
                                      Food and Nutrition Services
                                  </button>
                                    <button type="button" class="chip" data-metric="76" v-on:click="selectMetric(76, $event)">
                                      Home Sales Price
                                  </button>
                                    <button type="button" class="chip" data-metric="37" v-on:click="selectMetric(37, $event)">
                                      Household Income
                                  </button>
                                    <button type="button" class="chip" data-metric="75" v-on:click="selectMetric(75, $event)">
                                      Job Density
                                  </button>
                                    <button type="button" class="chip" data-metric="82" v-on:click="selectMetric(82, $event)">
                                      Housing Assistance
                                  </button>
                                    <button type="button" class="chip" data-metric="40" v-on:click="selectMetric(40, $event)">
                                      Rental Costs
                                  </button>
                                    <button type="button" class="chip" data-metric="69" v-on:click="selectMetric(69, $event)">
                                      Residential Foreclosures
                                  </button>
                                    <button type="button" class="chip" data-metric="8" v-on:click="selectMetric(8, $event)">
                                      Residential New Construction
                                  </button>
                                </p>
                                </a>
                            </div>
                            <div id="demographics" v-show="activeTab === 'demographics'">
                                <p>
                                    <button type="button" class="chip" data-metric="13" v-on:click="selectMetric(13, $event)">
                                        Population - Older Adult
                                    </button>
                                    <button type="button" class="chip" data-metric="12" v-on:click="selectMetric(12, $event)">
                                        Population - Youth
                                    </button>
                                    <button type="button" class="chip" data-metric="47" v-on:click="selectMetric(47, $event)">
                                        Population Density
                                    </button>
                                    <button type="button" class="chip" data-metric="17" v-on:click="selectMetric(17, $event)">
                                        Race/Ethnicity - All Other Races
                                    </button>
                                    <button type="button" class="chip" data-metric="16" v-on:click="selectMetric(16, $event)">
                                        Race/Ethnicity - Asian
                                    </button>
                                    <button type="button" class="chip" data-metric="15" v-on:click="selectMetric(15, $event)">
                                        Race/Ethnicity - Black or African American
                                    </button>
                                    <button type="button" class="chip" data-metric="18" v-on:click="selectMetric(18, $event)">
                                        Race/Ethnicity - Hispanic or Latino
                                    </button>
                                    <button type="button" class="chip" data-metric="14" v-on:click="selectMetric(14, $event)">
                                        Race/Ethnicity - White or Caucasian
                                    </button>
                                    <button type="button" class="chip" data-metric="11" v-on:click="selectMetric(11, $event)">
                                        Vacant Land
                                    </button>
                                </p>
                            </div>
                            <div id="environment" v-show="activeTab === 'environment'">
                                <p>
                                    <button type="button" class="chip" data-metric="34" v-on:click="selectMetric(34, $event)">
                                        Bicycle Friendliness
                                    </button>
                                    <button type="button" class="chip" data-metric="10" v-on:click="selectMetric(10, $event)">
                                        Commuters Driving Alone
                                    </button>
                                    <button type="button" class="chip" data-metric="26" v-on:click="selectMetric(26, $event)">
                                        Energy Consumption - Electricity
                                    </button>
                                    <button type="button" class="chip" data-metric="77" v-on:click="selectMetric(77, $event)">
                                        Energy Consumption - Natural Gas
                                    </button>
                                    <button type="button" class="chip" data-metric="4" v-on:click="selectMetric(4, $event)">
                                        Impervious Surface
                                    </button>
                                    <button type="button" class="chip" data-metric="33" v-on:click="selectMetric(33, $event)">
                                        Long Commute
                                    </button>
                                    <button type="button" class="chip" data-metric="23" v-on:click="selectMetric(23, $event)">
                                        Residential Recycling
                                    </button>
                                    <button type="button" class="chip" data-metric="24" v-on:click="selectMetric(24, $event)">
                                        Residential Solid Waste
                                    </button>
                                    <button type="button" class="chip" data-metric="3" v-on:click="selectMetric(3, $event)">
                                        Tree Canopy
                                    </button>
                                    <button type="button" class="chip" data-metric="27" v-on:click="selectMetric(27, $event)">
                                        Water Consumption
                                    </button>
                                </p>
                            </div>
                            <div id="health" v-show="activeTab === 'health'">
                                <p>
                                    <button type="button" class="chip" data-metric="57" v-on:click="selectMetric(57, $event)">
                                        Age of Death
                                    </button>
                                    <button type="button" class="chip" data-metric="54" v-on:click="selectMetric(54, $event)">
                                        Births to Adolescents
                                    </button>
                                    <button type="button" class="chip" data-metric="59" v-on:click="selectMetric(59, $event)">
                                        Crime - Property
                                    </button>
                                    <button type="button" class="chip" data-metric="58" v-on:click="selectMetric(58, $event)">
                                        Crime - Violent
                                    </button>
                                    <button type="button" class="chip" data-metric="60" v-on:click="selectMetric(60, $event)">
                                        Disorder-related Calls
                                    </button>
                                    <button type="button" class="chip" data-metric="20" v-on:click="selectMetric(20, $event)">
                                        Education - Bachelor&#39;s Degree
                                    </button>
                                    <button type="button" class="chip" data-metric="39" v-on:click="selectMetric(39, $event)">
                                        Education - High School Diploma
                                    </button>
                                    <button type="button" class="chip" data-metric="65" v-on:click="selectMetric(65, $event)">
                                        High School Graduation Rate
                                    </button>
                                    <button type="button" class="chip" data-metric="51" v-on:click="selectMetric(51, $event)">
                                        Library Card Holders
                                    </button>
                                    <button type="button" class="chip" data-metric="36" v-on:click="selectMetric(36, $event)">
                                        Proximity to Public Transportation
                                    </button>
                                    <button type="button" class="chip" data-metric="81" v-on:click="selectMetric(81, $event)">
                                        Public Health Insurance
                                    </button>
                                    <button type="button" class="chip" data-metric="44" v-on:click="selectMetric(44, $event)">
                                        Transit Ridership
                                    </button>
                                    <button type="button" class="chip" data-metric="62" v-on:click="selectMetric(62, $event)">
                                        Test Proficiency - Elementary School
                                    </button>
                                    <button type="button" class="chip" data-metric="64" v-on:click="selectMetric(64, $event)">
                                        Test Proficiency - High School
                                    </button>
                                    <button type="button" class="chip" data-metric="63" v-on:click="selectMetric(63, $event)">
                                        Test Proficiency - Middle School
                                    </button>
                                    <button type="button" class="chip" data-metric="48" v-on:click="selectMetric(48, $event)">
                                        Voter Participation
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- end tabs -->

                    <iframe aria-label="Quality of Life Embed" class="iframe-qol" v-bind:src="iframeURL" style="width: 100%; height: 600px; border: 1px solid #ccc"></iframe>
                </div>

            </div>
            <div class="row">
                <div class="column text-center">
                    <div style="padding: 10px 20px;">
                        Neighborhood vs
                        <select v-model="neighborhoodCompare">
                          <option value="Jurisdiction">Jurisdiction</option>
                          <option value="City Council">Charlotte City Council</option>
                          <option value="County Commission">County Commission</option>
                        </select>                        
                        <table class="qol-comparison" style="width: 100%;">
                            <tbody>
                                <tr v-for="(item, index) in trends" v-bind:data-qolgroup="item[0]" v-on:click="setCompare(item[0])">
                                    <td>
                                        {{item[0]}}
                                    </td>
                                    <td class="text-right">
                                        {{item[1]}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="no-print" style="margin-top: 20px;">
                        <div id="embed-textarea" class="text-left" style="width: 90%; margin: 0 auto;">
                          <label for="embedIframeCode">Embed this Map</label>    
                          <textarea type="text" rows="4" id="embedIframeCode" onclick="this.select()" v-on:keypress.stop.prevent autocomplete="off">{{ embedURL }}</textarea>                            
                        </div>
                    </div>

                </div>
                <div class="column text-center">                    
                    <div class="trendchart" v-show="showChart">
                        <h4>Trend</h4>
                        <span class="legend"><svg class="icon icon-trending_up legend-county"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-trending_up"></use></svg> {{chartCompare}}</span>
                        <span class="legend"><svg class="icon icon-trending_up legend-selected"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-trending_up"></use></svg> Neighborhood</span>
                        <div class="qol-chart-trend"></div>
                    </div>
                    <distChart></distChart>
                    <div class="no-print" style="margin-top: 20px">
                        <a class="button button-accent" v-bind:href="reportURL" target="_blank"  rel="noopener">Report</a>
                        <a class="button button-accent" v-bind:href="metaURL" target="_blank"  rel="noopener">META</a>
                    </div>
                    
                </div>                
            </div>

            <div class="report-moreinfo">
                <h5>For more information, please visit:</h5>
                <ul class="list-unstyled">
                    <li><a href="http://mcmap.org/qol/" target="_blank"  rel="noopener">Quality of Life Explorer</a></li>
                </ul>
            </div>
        </div>
    </div>
`;

export default {
  name: "quality_of_life",
  template: template,
  components: {
    distChart: distChart
  },
  data: function() {
    return {
      trends: null,
      chartData: null,
      neighborhood: null,
      metric: "76",
      showChart: false,
      activeTab: "economics",
      metaURL: "",
      reportURL: "",
      embedURL: "",
      iframeURL: null,
      neighborhoodCompare: "Jurisdiction",
      chartCompare: "County",
      year: "",
      qolData: null
    };
  },
  mounted: function() {
    let _this = this;

    // highlight selected metrics
    let chip = document.querySelector(`.chip[data-metric="${_this.metric}"]`);
    if (chip) {
      chip.classList.add("chip-active");
    }

    // if you have a lnglat, get getResults
    if (_this.$parent.sharedState.selected.lnglat) {
      _this.getResults();
    }
    // if you have lnglat or the init flag is set,
    if (
      !_this.$parent.sharedState.selected.lnglat &&
      !_this.$parent.sharedState.initLnglatFlag
    ) {
      _this.setIframe();
    }
    window.onmessage = function(e) {
      let data = e.data;
      if (data.summary) {
        _this.qolData = data.summary;
      }
    };
  },
  watch: {
    qolData: "dataReceived",
    neighborhood: "setIframe",
    "$parent.sharedState.selected.lnglat": "getResults",
    "$parent.sharedState.show": "getResults",
    metric: "passMetric",
    chartData: "chart",
    chartCompare: "chart",
    neighborhoodCompare: "changeNeighborhoodCompare"
  },
  methods: {
    dataReceived: function() {
      let _this = this;
      // set variables
      _this.year = _this.qolData.year;
      // set links
      _this.reportURL = `https://mcmap.org/qol-mecklenburg/report/?m=${
        this.metric
      }&s=${this.qolData.selected.join(",")}&y=${this.year}`;
      _this.embedURL = `<iframe src="https://mcmap.org/qol-mecklenburg/embed/?m=${
        this.metric
      }&y=${this.year}&s=${this.qolData.selected.join(
        ","
      )}" style="width: 500px; height: 500px; border: 1px solid #595959"></iframe>`;
      _this.metaURL = `https://mcmap.org/qol-mecklenburg/embed/data/meta/m${
        _this.metric
      }.html`;
      // set chart data
      _this.chartData = _this.qolData;
      // set trend data
      _this.trends = _this.setTrendData(_this.qolData);
    },
    setTrendData: function(data) {
      let _this = this;
      let compare = data.values[_this.neighborhoodCompare];
      let compareKeys = Object.keys(compare);
      let compareData = [];
      for (let i = 0; i < compareKeys.length; i++) {
        compareData.push([
          compareKeys[i],
          compare[compareKeys[i]][data.years.indexOf(data.year)]
        ]);
      }
      if (data.values["Neighborhood"].length > 0) {
        compareData.push([
          "Neighborhood",
          data.values["Neighborhood"][data.years.indexOf(data.year)]
        ]);
      }
      compareData = compareData.sort(function(a, b) {
        return naturalSort(
          b[1].replace(/[^0-9-.]/g, ""),
          a[1].replace(/[^0-9-.]/g, "")
        );
      });
      return compareData;
    },
    getResults: function() {
      if (
        this.$parent.sharedState.selected.lnglat &&
        this.$parent.sharedState.show.indexOf("qualityoflife") !== -1
      ) {
        let _this = this;
        let params = {
          geom_column: "the_geom",
          columns: "id",
          limit: 1
        };
        fetch(
          `https://mcmap.org/api/intersect_point/v1/neighborhoods/${_this.$parent.sharedState.selected.lnglat.join(
            ","
          )}/4326?${jsonToURL(params)}`
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.neighborhood = data[0].id;
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      }
    },
    changeNeighborhoodCompare: function(comparetype) {
      let _this = this;
      this.neighborhoodCompare = comparetype;
      if (comparetype === "Jurisdiction") {
        this.chartCompare = "County";
      } else {
        this.chartCompare = "District 1";
      }
      this.dataReceived();
    },
    setCompare: function(compare) {
      if (compare !== "Neighborhood") {
        this.chartCompare = compare;
      }
    },
    setIframe: function() {
      let _this = this;
      if (!this.iframeURL) {
        this.iframeURL = `https://mcmap.org/qol-mecklenburg/embed/?m=${
          this.metric
        }&s=${this.neighborhood}`;
      } else {
        document.querySelector(".iframe-qol").contentWindow.postMessage(
          {
            selected: [_this.neighborhood.toString()]
          },
          "*"
        );
      }
    },
    createIframe: function() {
      return `https://mcmap.org/qol-mecklenburg/embed/?m=${this.metric}&s=${
        this.neighborhood
      }&y=${this.year}`;
    },
    passMetric: function() {
      let _this = this;
      document.querySelector(".iframe-qol").contentWindow.postMessage(
        {
          metric: _this.metric
        },
        "*"
      );
    },
    selectMetric: function(m, event) {
      this.metric = m;
      let btns = document.querySelectorAll("button.chip");
      for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("chip-active");
      }
      event.target.classList.add("chip-active");
    },
    chart: function() {
      let _this = this;
      if (_this.chartData && _this.chartData.years.length > 1) {
        _this.showChart = true;
        let minYear = _this.chartData.years[0];
        let maxYear = _this.chartData.years[_this.chartData.years.length - 1];
        let yearsLength = parseInt(maxYear) - parseInt(minYear) + 1;
        let filledYears = Array.apply(0, Array(yearsLength)).map(function(
          _,
          b
        ) {
          return b + parseInt(minYear);
        });

        let options = {
          fullWidth: true,
          low: 0,
          lineSmooth: Chartist.Interpolation.cardinal({
            fillHoles: true
          }),
          chartPadding: {
            right: 40
          },
          axisX: {
            labelInterpolationFnc: function(value, index) {
              if (filledYears.length > 6) {
                return index % 3 === 0 ? value : null;
              } else {
                return value;
              }
            }
          },
          axisY: {
            labelInterpolationFnc: function(value, index) {
              return abbrNumber(value, 2);
            }
          }
        };
        let data = {
          labels: _this.chartData.years.map(function(el) {
            return parseInt(el);
          }),
          series: []
        };
        // set compare series
        if (
          _this.chartData.values[_this.neighborhoodCompare][_this.chartCompare]
        ) {
          data.series.push(
            _this.chartData.values[_this.neighborhoodCompare][
              _this.chartCompare
            ].map(function(num) {
              return parseFloat(num.replace(/[^0-9-.]/g, ""));
            })
          );
        } else {
          data.series.push(
            _this.chartData.values["Jurisdiction"]["County"].map(function(num) {
              return parseFloat(num.replace(/[^0-9-.]/g, ""));
            })
          );
        }
        // set selected series
        if (_this.chartData.values.Neighborhood.length > 0) {
          data.series.push(
            _this.chartData.values.Neighborhood.map(function(num) {
              return parseFloat(num.replace(/[^0-9-.]/g, ""));
            })
          );
        }
        // fill in years in data series
        for (let i = 0; i < filledYears.length; i++) {
          if (data.labels.indexOf(filledYears[i]) === -1) {
            data.series.forEach(function(element, index, array) {
              data.series[index].splice(i, 0, null);
            });
          }
        }
        data.labels = filledYears;

        new Chartist.Line(".qol-chart-trend", data, options);
      } else if (_this.chartData) {
        _this.showChart = false;
      }
    }
  }
};
