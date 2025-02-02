"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y["return"]
                                    : op[0]
                                      ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                                      : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRegister = exports.useLogin = void 0;
var baseUrl = ""; // will need to be changed to actual URl and store in .env
function useLogin(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, loginRegister(email, password, "login")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.useLogin = useLogin;
// used to hit the login or register endpoint and store the asociated information for that user within their browser local storage
function loginRegister(email, password, route) {
    return __awaiter(this, void 0, void 0, function () {
        var url, userReq, _a, accessToken, refreshToken, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = baseUrl + "/auth/" + route;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [
                        4 /*yield*/,
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: email,
                                password: password,
                            }),
                        }),
                    ];
                case 2:
                    userReq = _b.sent();
                    if (!userReq.ok) {
                        throw Error("Unable to complete operation: " + route + " status code: " + userReq.statusText);
                    }
                    return [4 /*yield*/, userReq.json()];
                case 3:
                    (_a = _b.sent()), (accessToken = _a.accessToken), (refreshToken = _a.refreshToken);
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("email", email);
                    localStorage.setItem("password", password);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 5];
                case 5:
                    return [2 /*return*/];
            }
        });
    });
}
exports.loginRegister = loginRegister;
useLogin("beak@gmail.com", "meow");
