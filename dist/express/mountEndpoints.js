"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mountEndpoints(router, endpoints) {
    endpoints.forEach((endpoint) => {
        router[endpoint.method](endpoint.path, endpoint.handler);
    });
}
exports.default = mountEndpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91bnRFbmRwb2ludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhwcmVzcy9tb3VudEVuZHBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLFNBQVMsY0FBYyxDQUFDLE1BQWMsRUFBRSxTQUFxQjtJQUMzRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==