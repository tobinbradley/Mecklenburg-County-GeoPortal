let template = `
    <div class="selected-location text-center" v-if="sharedState.show !== 'welcome'">
        <h2 class="print-only">GeoPortal<br>Mecklenburg County GIS</h2>
        <span v-if="sharedState.selected.address">{{ sharedState.selected.address }}</span>
    </div>
`;

export default {
  name: "selected-location",
  template: template
};
