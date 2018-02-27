let template = `
    <div class="selected-location" v-if="sharedState.show !== 'welcome'">
        <h4 class="print-only">GeoPortal<br>Mecklenburg County GIS</h4>
        <span v-if="sharedState.selected.address"><i class="icon icon-place"></i> {{ sharedState.selected.address }}</span>
    </div>
`;

export default {
  name: "selected-location",
  template: template
};
