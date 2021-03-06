webpackJsonp([0],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_locations_locations__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LocationsPage = /** @class */ (function () {
    function LocationsPage(navCtrl, navParams, geolocation, camera, locationsProvider, toast, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.camera = camera;
        this.locationsProvider = locationsProvider;
        this.toast = toast;
        this.alertCtrl = alertCtrl;
        this.options = {
            quality: 30,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA,
            allowEdit: false,
            mediaType: this.camera.MediaType.PICTURE,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: true,
            correctOrientation: true // Camera orientation  
        };
        this.currentLat = this.navParams.get('currentLat');
        this.currentLng = this.navParams.get('currentLng');
        this.startCamera = this.navParams.get('startCamera');
    }
    LocationsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LocationsPage');
        this.createNewLocation();
        this.reloadLocations();
        if (this.startCamera) {
            console.log('Start camera after init page...');
            this.takePicture();
        }
        if (!this.currentLat || !this.currentLng) {
            this.catchLocation();
        }
        else {
            this.model.lat = +(this.currentLat).toFixed(4);
            this.model.lng = +(this.currentLng).toFixed(4);
        }
    };
    LocationsPage.prototype.reloadLocations = function () {
        var _this = this;
        this.locationsProvider.getAll()
            .then(function (result) {
            _this.locations = result;
            _this.locations.reverse();
        });
    };
    LocationsPage.prototype.createNewLocation = function () {
        if (!this.model) {
            this.model = new __WEBPACK_IMPORTED_MODULE_4__providers_locations_locations__["a" /* Location */]();
        }
    };
    LocationsPage.prototype.removeLocation = function (item) {
        var _this = this;
        this.locationsProvider.remove(item.key)
            .then(function () {
            // removing from array of itens
            var index = _this.locations.indexOf(item);
            _this.locations.splice(index, 1);
            _this.toast.create({ message: 'Local removido.', duration: 1500, position: 'botton' }).present();
        });
    };
    LocationsPage.prototype.takePicture = function () {
        var _this = this;
        this.camera.getPicture(this.options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            //this.model.photo = 'data:image/png;base64,' + imageData;
            _this.model.photo = imageData;
        }).catch(function (error) {
            console.log('Error on taking photo', error);
            _this.toast.create({ message: 'Falhou ao acionar a camera de seu dispositivo.', duration: 1500, position: 'botton' }).present();
        });
    };
    LocationsPage.prototype.prepareHeader = function (img) {
        if (img.startsWith('file')) {
            return img;
        }
        else {
            return 'data:image/png;base64,' + img;
        }
    };
    LocationsPage.prototype.catchLocation = function () {
        var _this = this;
        var locationOptions = { timeout: 10000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(locationOptions).then(function (position) {
            _this.model.lat = +(position.coords.latitude).toFixed(4);
            _this.model.lng = +(position.coords.longitude).toFixed(4);
        }).catch(function (error) {
            console.log('Error getting location', error);
            _this.toast.create({ message: 'Falhou ao capturar sua localização.', duration: 1500, position: 'botton' }).present();
        });
    };
    LocationsPage.prototype.save = function () {
        var _this = this;
        this.saveLocation()
            .then(function () {
            _this.toast.create({ message: 'Local salvo.', duration: 1500, position: 'botton' }).present();
            _this.model = undefined;
            _this.createNewLocation();
            _this.reloadLocations();
            _this.catchLocation();
        })
            .catch(function () {
            _this.toast.create({ message: 'Erro ao salvar o local.', duration: 1500, position: 'botton' }).present();
        });
    };
    LocationsPage.prototype.saveLocation = function () {
        return this.locationsProvider.insert(this.model);
    };
    LocationsPage.prototype.sendDataToServer = function (item) {
        if (item == undefined) {
            var l = this.locations.length;
            for (var i = 0; i < l; i++) {
                if (!this.locations[i].location.send) {
                    this.sendToServer(this.locations[i].location, this.locations[i].key);
                }
            }
        }
        else {
            this.sendToServer(item.location, item.key);
        }
    };
    LocationsPage.prototype.setServerURL = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Serviço para envio de dados',
            inputs: [
                {
                    name: 'server_url',
                    placeholder: this.locationsProvider.getServerURL(),
                    type: 'url'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Atribuir',
                    handler: function (data) {
                        if (data.server_url) {
                            _this.locationsProvider.setServerURL(data.server_url);
                        }
                        else {
                            console.log('Input URL is undefined');
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    LocationsPage.prototype.sendToServer = function (location, key) {
        var _this = this;
        this.locationsProvider.sendToServer(location)
            .then(function () {
            location.send = true;
            _this.locationsProvider.update(key, location);
            _this.toast.create({ message: 'Upload com sucesso.', duration: 1500, position: 'botton' }).present();
        })
            .catch(function () {
            _this.toast.create({ message: 'Erro ao enviar dados.', duration: 1500, position: 'botton' }).present();
        });
    };
    LocationsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-locations',template:/*ion-inline-start:"/home/andre/Projects/IonicAppTheming/src/pages/locations/locations.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons end>\n      <button ion-button (click)="sendDataToServer()">\n        <ion-icon name="cloud-upload"></ion-icon>\n      </button>\n      <button ion-button (click)="setServerURL()">\n        <ion-icon name="options"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>Lista de lugares</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-list *ngIf="model">\n    <ion-card>\n\n      <ion-item>\n\n        <ion-thumbnail item-start>\n          <img [src]="prepareHeader(model.photo)" *ngIf="model && model.photo">\n        </ion-thumbnail>\n        \n        <button ion-button block icon-right color="default" (click)="takePicture()" *ngIf="model && !model.photo">\n          Capturar uma foto\n          <ion-icon name="camera"></ion-icon>\n        </button>\n      </ion-item>\n      \n      <ion-item>\n        <ion-label floating>Descrição</ion-label>\n        <ion-input type="text" name="description" [(ngModel)]="model.description"></ion-input>\n      </ion-item>\n\n      <ion-item>\n        <p>Lat/Long( <span [innerHTML]="model.lat"></span>, <span [innerHTML]="model.lng"></span> )</p>\n\n        <button ion-button icon-left clear item-end (click)="save()">\n          <ion-icon name="done-all"></ion-icon> Salvar\n        </button>\n      </ion-item>\n      \n    </ion-card>\n  </ion-list>\n\n  <ion-list>\n    <ion-card *ngFor="let item of locations">\n      <ion-item>\n        <ion-thumbnail item-start>\n          <img [src]="prepareHeader(item.location.photo)" *ngIf="item.location.photo">\n        </ion-thumbnail>\n        <p>Criação: {{ item.location.timeref | date:\'dd/MM/yyyy\' }}</p>\n\n        <p>Descrição: {{ item.location.description }}</p>\n      </ion-item>\n      <ion-item>\n        <p>Lat/Long( {{ item.location.lat }} , {{ item.location.lng }} )</p>\n\n        <button ion-button icon-left clear item-end (click)="removeLocation(item)">\n          <ion-icon name="trash"></ion-icon>\n        </button>\n        <button ion-button icon-left clear item-end (click)="sendDataToServer(item)" *ngIf="!item.location.send">\n          <ion-icon name="cloud-upload"></ion-icon>\n        </button>\n      </ion-item>\n      \n    </ion-card>\n  </ion-list>\n\n</ion-content>'/*ion-inline-end:"/home/andre/Projects/IonicAppTheming/src/pages/locations/locations.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__providers_locations_locations__["b" /* LocationsProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], LocationsPage);
    return LocationsPage;
}());

//# sourceMappingURL=locations.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LocationsProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Location; });
/* unused harmony export LocationList */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_base64__ = __webpack_require__(202);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var LocationsProvider = /** @class */ (function () {
    function LocationsProvider(base64, storage, datepipe, http) {
        this.base64 = base64;
        this.storage = storage;
        this.datepipe = datepipe;
        this.http = http;
        this.API_URL = 'http://www.terrama2.dpi.inpe.br/vita3';
        console.log('Hello LocationsProvider Provider');
    }
    LocationsProvider.prototype.setServerURL = function (url) {
        this.API_URL = url;
    };
    LocationsProvider.prototype.getServerURL = function () {
        return this.API_URL;
    };
    LocationsProvider.prototype.insert = function (location) {
        var key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
        location.timeref = new Date();
        if (!location.description) {
            location.description = 'Sem descrição.';
        }
        return this.save(key, location);
    };
    LocationsProvider.prototype.update = function (key, location) {
        return this.save(key, location);
    };
    LocationsProvider.prototype.save = function (key, location) {
        return this.storage.set(key, location);
    };
    LocationsProvider.prototype.remove = function (key) {
        return this.storage.remove(key);
    };
    LocationsProvider.prototype.getAll = function () {
        var locations = [];
        return this.storage.forEach(function (value, key, iterationNumber) {
            var location = new LocationList();
            location.key = key;
            location.location = value;
            locations.push(location);
        })
            .then(function () {
            return Promise.resolve(locations);
        })
            .catch(function (error) {
            return Promise.reject(error);
        });
    };
    LocationsProvider.prototype.sendToServer = function (location) {
        var _this = this;
        if (location.photo.startsWith('file')) {
            return this.base64.encodeFile(location.photo).then(function (base64File) {
                var photo = base64File.replace('data:image/*;charset=utf-8;base64,', '');
                return _this.postDataToServer(location, photo);
            }, function (err) {
                console.log(err);
            });
        }
        else {
            return this.postDataToServer(location, location.photo);
        }
    };
    LocationsProvider.prototype.postDataToServer = function (location, photo) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpHeaders */]().set('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        var url = this.API_URL + '/locations';
        var data = {
            'description': location.description,
            'lat': location.lat,
            'lng': location.lng,
            'datetime': location.timeref.toISOString(),
            'photo': photo
        };
        return new Promise(function (resolve, reject) {
            _this.http.post(url, data, { headers: headers })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    LocationsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__ionic_native_base64__["a" /* Base64 */], __WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__angular_common__["d" /* DatePipe */], __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */]])
    ], LocationsProvider);
    return LocationsProvider;
}());

var Location = /** @class */ (function () {
    function Location() {
    }
    return Location;
}());

var LocationList = /** @class */ (function () {
    function LocationList() {
    }
    return LocationList;
}());

//# sourceMappingURL=locations.js.map

/***/ }),

/***/ 114:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 114;

/***/ }),

/***/ 156:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 156;

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__burnered_burnered__ = __webpack_require__(204);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage.prototype.goToBurnered = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__burnered_burnered__["a" /* BurneredPage */]);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/home/andre/Projects/IonicAppTheming/src/pages/home/home.html"*/'<ion-header no-border>\n  <ion-navbar transparent>\n    <ion-title>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-grid>\n    <ion-row>\n      <ion-col col-3></ion-col>\n      <ion-col col-6>\n        <ion-item text-wrap>\n          Eu Fiscal\n          <div class="eufiscalborder"></div>\n        </ion-item>\n      </ion-col>\n      <ion-col col-3></ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-12 class="text1">\n        Insira seus dados para login\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-2></ion-col>\n      <ion-col col-8>\n        <ion-item>\n          <ion-label floating>Usuário</ion-label>\n          <ion-input type="text" value=""></ion-input>\n        </ion-item>\n      \n        <ion-item>\n          <ion-label floating>Senha</ion-label>\n          <ion-input type="password"></ion-input>\n        </ion-item>\n      </ion-col>\n      <ion-col col-2></ion-col>\n    </ion-row>\n   \n    <ion-row>\n      <ion-col col-2></ion-col>\n      <ion-col col-8 class="text2">\n        <div class="forgotpass">Esqueci minha senha\n        </div>\n      </ion-col>\n      <ion-col col-2></ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-12 style="text-align:center;">\n        <button ion-button icon-end round (click)="goToBurnered()">\n          Login<ion-icon name="person"></ion-icon>\n        </button>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-12>\n        <ion-label class="text3">Ainda não é cadastrado?</ion-label>\n        <ion-label class="text4">Cadastre-se agora</ion-label>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/home/andre/Projects/IonicAppTheming/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BurneredPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_map__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__locations_locations__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BurneredPage = /** @class */ (function () {
    function BurneredPage(navCtrl, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
    }
    BurneredPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BurneredPage');
    };
    BurneredPage.prototype.goToInfo = function () {
        var alert = this.alertCtrl.create({
            title: 'Para informar uma ocorrência.',
            subTitle: 'Tire uma foto, capture sua localização e envie para o sistema de alertas.',
            buttons: ['ok']
        });
        alert.present();
    };
    BurneredPage.prototype.goToMap = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */]);
    };
    BurneredPage.prototype.goToCamera = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__locations_locations__["a" /* LocationsPage */], { startCamera: true });
    };
    BurneredPage.prototype.goToEdit = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__locations_locations__["a" /* LocationsPage */]);
    };
    BurneredPage.prototype.sendDataToServer = function () {
    };
    BurneredPage.prototype.goToLocations = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__locations_locations__["a" /* LocationsPage */], {
            currentLat: 'não definido',
            currentLng: 'não definido',
            startCamera: true
        });
    };
    BurneredPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-burnered',template:/*ion-inline-start:"/home/andre/Projects/IonicAppTheming/src/pages/burnered/burnered.html"*/'<!--\n  Generated template for the BurneredPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>Queimadas</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n    <ion-grid>\n      <ion-row>\n        <ion-col col-3></ion-col>\n        <ion-col col-6>\n          <ion-item text-wrap>\n            Eu Fiscal\n            <div class="eufiscalborder"></div>\n          </ion-item>\n        </ion-col>\n        <ion-col col-3></ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-12 class="burnedtext">\n          QUEIMADAS\n          <div class="burnedborder"></div>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-1></ion-col>\n        <ion-col col-10 class="text1">\n            Queimada é uma prática primitiva da agricultura, destinada principalmente à limpeza do terreno para o cultivo de plantações ou formação de pastos, com uso do fogo de forma controlada que às vezes pode descontrolar-se e causar incêndios em florestas, matas e terrenos grandes.\n        </ion-col>\n        <ion-col col-1></ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-1></ion-col>\n        <ion-col col-10 class="text2">\n          Agora você pode nos ajudar a fiscalizar as queimadas.\n        </ion-col>\n        <ion-col col-1></ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-12>\n          <ion-label class="textred">Viu alguma queimada?</ion-label>\n          <ion-label class="textred">Denuncie!</ion-label>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n\n    <ion-fab bottom center>\n      <button ion-fab (click)="goToCamera()">\n        <ion-icon name="camera"></ion-icon>\n      </button>\n    </ion-fab>\n\n  </ion-content>\n  <ion-footer>\n    <ion-toolbar>\n      <ion-grid>\n        <ion-row>\n          <ion-col col-1></ion-col>\n          <ion-col col-2>\n            <button icon-only (click)="goToInfo()">\n              <ion-icon name="information-circle"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-2>\n            <button icon-only (click)="goToMap()">\n              <ion-icon name="pin"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-2>\n          </ion-col>\n          <ion-col col-2>\n            <button icon-only (click)="goToEdit()">\n              <ion-icon name="list-box"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-2>\n            <button icon-only (click)="goToEdit()">\n              <ion-icon name="cloud-upload"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-1></ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-toolbar>\n  </ion-footer>'/*ion-inline-end:"/home/andre/Projects/IonicAppTheming/src/pages/burnered/burnered.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], BurneredPage);
    return BurneredPage;
}());

//# sourceMappingURL=burnered.js.map

/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__locations_locations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_locations_locations__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MapPage = /** @class */ (function () {
    function MapPage(alertCtrl, locationsProvider, navCtrl, geolocation) {
        this.alertCtrl = alertCtrl;
        this.locationsProvider = locationsProvider;
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.btColor = '#c0c0c0';
        this.markers = [];
        this.currentCoords = { 'lat': 0, 'lng': 0 };
    }
    /* Initialize the map only when Ion View is loaded */
    MapPage.prototype.ionViewDidLoad = function () {
        this.initializeMap();
        this.addLocation();
    };
    MapPage.prototype.goToLocations = function () {
        if (this.markers.length) {
            var l = this.markers.length;
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__locations_locations__["a" /* LocationsPage */], {
                currentLat: this.markers[l - 1].getPosition().lat(),
                currentLng: this.markers[l - 1].getPosition().lng(),
                startCamera: true
            });
        }
    };
    MapPage.prototype.useCurrentCoords = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__locations_locations__["a" /* LocationsPage */], {
            currentLat: this.currentCoords.lat,
            currentLng: this.currentCoords.lng,
            startCamera: false
        });
    };
    MapPage.prototype.setCurrentCoords = function (lat, lng) {
        this.currentCoords.lat = lat;
        this.currentCoords.lng = lng;
    };
    /*
    * This function will create and show a marker representing your location
    */
    MapPage.prototype.showMyLocation = function (position) {
        var _this = this;
        var newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(newPosition);
        this.map.setZoom(15);
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: newPosition,
            draggable: true
        });
        this.markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            var markerInfo = '<h6>Latitude:' + lat.toFixed(4) + '</h6>' +
                '<h6>Longitude:' + lng.toFixed(4) + '</h6><input type="button" value="Usar este local" ' +
                'onclick="document.getElementById(\'infowindowhidden\').click()" />';
            var infoModal = new google.maps.InfoWindow({
                content: markerInfo
            });
            infoModal.open(_this.map, marker);
            marker.getInfoModal = function () {
                return infoModal;
            };
            _this.setCurrentCoords(lat, lng);
        });
        google.maps.event.addListener(marker, 'dragstart', function () {
            marker.getInfoModal().close();
        });
        // google.maps.event.addListener(marker, 'dragend', () => {
        //   this.resetMarkerPosition(marker);
        // });
    };
    MapPage.prototype.initializeMap = function () {
        var demoCenter = new google.maps.LatLng(-23, -45);
        var options = {
            center: demoCenter,
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            scaleControl: false,
            streetViewControl: false
        };
        /* Show demo location */
        this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
    };
    MapPage.prototype.addLocation = function () {
        var _this = this;
        var locationOptions = { timeout: 10000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(locationOptions).then(function (position) {
            /* We can show our location only if map was previously initialized */
            _this.showMyLocation(position);
        }).catch(function (error) {
            console.log('Error getting location', error);
            var alert = _this.alertCtrl.create({
                title: 'Falha GPS',
                subTitle: 'Falou ao capturar sua localização. Erro informado: ' + error.message,
                buttons: ['ok']
            });
            alert.present();
        });
    };
    MapPage.prototype.startWatchingLocation = function () {
        var _this = this;
        this.stopWatchingLocation();
        if (this.watchLocation == undefined) {
            this.watchLocation = this.geolocation.watchPosition().subscribe(function (position) {
                if (position != undefined) {
                    _this.btColor = '#00ff00'; // on
                    var newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    _this.map.setCenter(newPosition);
                    _this.map.setZoom(15);
                    if (_this.currentLocation != undefined) {
                        _this.currentLocation.setMap(null);
                    }
                    _this.currentLocation = new google.maps.Marker({
                        map: _this.map,
                        position: newPosition,
                        icon: {
                            url: "./assets/imgs/marker25x25.png",
                            size: {
                                width: 25,
                                height: 25
                            }
                        }
                    });
                }
            });
        }
    };
    MapPage.prototype.stopWatchingLocation = function () {
        // To stop notifications
        if (this.currentLocation != undefined) {
            this.btColor = '#c0c0c0'; // off
            this.currentLocation.setMap(null);
            this.watchLocation.unsubscribe();
        }
        else {
            this.btColor = '#FFFF00'; // try on
        }
    };
    MapPage.prototype.removeLastLocation = function () {
        var m = this.markers.pop();
        if (m != undefined)
            m.setMap(null);
    };
    MapPage.prototype.clearMarkers = function () {
        while (this.markers.length) {
            this.removeLastLocation();
        }
    };
    MapPage.prototype.reloadLocations = function () {
        var _this = this;
        this.locationsProvider.getAll()
            .then(function (result) {
            _this.locations = result;
            _this.displaySavedMarkers(_this.locations);
        });
    };
    MapPage.prototype.displaySavedMarkers = function (locations) {
        this.savedLocations = [];
        var localColor = "FE7569";
        var localImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + localColor, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
        var remoteColor = "5cf5e0";
        var remoteImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + remoteColor, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
        for (var key in locations) {
            if (locations.hasOwnProperty(key)) {
                var item = locations[key];
                if (item.location != undefined) {
                    var newPosition = new google.maps.LatLng(item.location.lat, item.location.lng);
                    this.savedLocations.push(new google.maps.Marker({
                        map: this.map,
                        position: newPosition,
                        title: item.location.description,
                        label: ((item.location.send) ? ('R') : ('L')),
                        icon: ((item.location.send) ? (remoteImage) : (localImage))
                    }));
                }
            }
        }
    };
    MapPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-map',template:/*ion-inline-start:"/home/andre/Projects/IonicAppTheming/src/pages/map/map.html"*/'<ion-header>\n  <ion-navbar>      \n    <ion-buttons end>\n      <button style="visibility: hidden;" id="infowindowhidden" (click)="useCurrentCoords()"></button>\n      <button ion-button icon-only (click)="goToLocations()">\n          <ion-icon name="camera"></ion-icon>\n      </button>\n      <button ion-button icon-only [ngStyle]="{\'background-color\': btColor }" (click)="startWatchingLocation()">\n          <ion-icon name="locate"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>Mapa</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-fab bottom right>\n    <button ion-fab mini><ion-icon name="pin"></ion-icon></button>\n    <ion-fab-list side="left">\n      <button ion-fab mini (click)="addLocation()"><ion-icon name="add-circle"></ion-icon></button>\n      <button ion-fab mini (click)="removeLastLocation()"><ion-icon name="remove-circle"></ion-icon></button>\n    </ion-fab-list>\n  </ion-fab>\n  \n  <div id="map_canvas"></div>\n  \n</ion-content>\n'/*ion-inline-end:"/home/andre/Projects/IonicAppTheming/src/pages/map/map.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__providers_locations_locations__["b" /* LocationsProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */]])
    ], MapPage);
    return MapPage;
}());

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(227);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_camera__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common_http__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_base64__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_component__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_home_home__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_burnered_burnered__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_map_map__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_locations_locations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_locations_locations__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_12__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_burnered_burnered__["a" /* BurneredPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_locations_locations__["a" /* LocationsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["a" /* IonicStorageModule */].forRoot({
                    name: '__terramadb',
                    driverOrder: ['indexeddb', 'sqlite', 'websql']
                }),
                __WEBPACK_IMPORTED_MODULE_9__angular_common_http__["b" /* HttpClientModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_12__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_burnered_burnered__["a" /* BurneredPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_locations_locations__["a" /* LocationsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_16__providers_locations_locations__["b" /* LocationsProvider */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_8__angular_common__["d" /* DatePipe */],
                __WEBPACK_IMPORTED_MODULE_16__providers_locations_locations__["b" /* LocationsProvider */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_base64__["a" /* Base64 */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(203);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/andre/Projects/IonicAppTheming/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/home/andre/Projects/IonicAppTheming/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[206]);
//# sourceMappingURL=main.js.map