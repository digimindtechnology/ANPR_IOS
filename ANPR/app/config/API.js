

// const URL = "https://gscapi.buildesk.com/";
// https://gscapi.buildesk.com/Login/UserInfo?userID=2259&CompanyID=1085

import RestClient from 'react-native-rest-client';

export default class API extends RestClient {
    constructor(URL) {
        super(URL);
    }
    
    UserLogin(data){
        return this.POST('UserLogin',data);
    }

    VehicleHistoricalLocationList(data){
        return this.POST('VehicleHistoricalLocationList',data);
    }

    VehicleAlerts(data){
        return this.POST('VehicleAlerts',data);
    }

    VehicleExpireRegistration(data){
        return this.POST('VehicleExpireRegistration',data);
    }

    MpTransPortData(data){
        return this.POST('MpTransPortData',data);
    }

    SuspectedVehicleImposibleSpace(data){
        return this.POST('SuspectedVehicleImposibleSpace',data);
    }

    SuspectedVehicleNotMatchedMpTransport(data){
        return this.POST('SuspectedVehicleNotMatchedMpTransport',data);
    }

    GetDistrict(data){
        return this.POST('GetDistrict',data);
    }

    GetPoliceStationByCity(data){
        return this.POST('GetPoliceStationByCity',data);
    }

    GetStolenVehicleList(data){
        return this.POST('GetStolenVehicleList',data);
    }

    GetFeedbackUserWiseList(data){
        return this.POST('GetFeedbackUserWiseList',data);
    }

    PostFeedback(data){
        return this.POST('PostFeedback',data);
    }

    SendPartialMessage(data){
        return this.POST('SendPartialMessage',data)
    }
    GetMakerSelectList(data){
        return this.POST('GetMakerSelectList',data)
    }
    GetMakerClassificationSelectList(data){
        return this.POST('GetMakerClassificationSelectList',data)
    }
    GetColorsSelectList(data){
        return this.POST('GetColorsSelectList',data)
    }
    GetOwnerShipSearchRecords(data){
        return this.POST('GetOwnerShipSearchRecords',data)
    }

    GetAppVersion(data){
        return this.POST('GetAppVersion',data);
    }
    
    PostOTP(data){
        return this.POST('PostOTP',data);
    }

    VehicleHistoryByCity(data){
        return this.POST('VehicleHistoryByCity',data);
    }

    GetSubCityList(data){
        return this.POST('GetSubCityList',data)
    }

    GetLocationList(data){
        return this.POST('GetLocationList',data)
    }

}