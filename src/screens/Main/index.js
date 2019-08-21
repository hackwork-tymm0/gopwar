
import React, { Component } from "react";
import Axios from "axios";
import io from "socket.io-client"

import { Button, Input } from "reactstrap"

import Game from "../Game";

const style = {
    skin: {
        width: 150,
        cursor: "pointer",
        marginRight: 10,
    }
};

export default class Main extends Component {
    constructor () {
        super();

        this.state = {
            step: "FIRST",
            skinHover: [ false, false, false, false, false ],
            name: "",
            skin: "",
            server: "",
            connect: false
        };

        this.checkName = this.checkName.bind(this);
        this.checkServer = this.checkServer.bind(this);
    }

    checkName () {
        if (this.state.name !== "") {
            this.setState({
                step: "SECOND"
            });
        } else {
            alert("Ты че, без имени что ли? Тебе сюда нельзя");
        }
    }

    checkServer () {
        if (this.state.server !== "") {
            Axios.get(`http://${this.state.server}/check`)
            .then((response) => {
                if (response.data === "ok") {
                    this.setState({ connect: true, step: "GAME" });
                } else {
                    alert("Че-то район какой-то неправильный");
                }
            })
            .catch((err) => alert("Кажись такого района нет!"))
        } else {
            alert("Ты че бля, адрес-то введи!");
        }
    }

    render () {
        switch (this.state.step) {
            case "FIRST":
                return (
                    <div>
                        <center style={{ marginTop: "25%" }}>
                            <h2> Тебя как звать, чувырла? </h2>
                            <Input 
                                style={{ width: "50%", marginTop: 10, marginBottom: 10 }}
                                placeholder="Сюда писать буквы"
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                            <Button color="primary" onClick={this.checkName}>Вот как, бля!</Button>
                        </center>
                    </div>
                );
                
            case "SECOND":
                return (
                    <div>
                        <center style={{ marginTop: "25%" }}>
                            <h2> Выбери себе прикид, ЩЕГОЛ! </h2>
                            <div style={{
                                marginTop: 10
                            }}>
                                <img 
                                    src={require("../../resources/skins/degelev.png")}
                                    alt="Дегелев, епта!"
                                    style={{
                                        ...style.skin,
                                        opacity: this.state.skinHover[0] ? 1 : 0.5
                                    }}
                                    onMouseEnter={() => this.setState({ skinHover: [ true, false, false, false, false ] })}
                                    onMouseLeave={() => this.setState({ skinHover: [ false, false, false, false, false ] })}

                                    onClick={() => this.setState({
                                        skin: "degelev",
                                        step: "THIRD"
                                    })}
                                />
                                <img 
                                    src={require("../../resources/skins/getz.png")}
                                    alt="Гецуха!"
                                    style={{
                                        ...style.skin,
                                        opacity: this.state.skinHover[1] ? 1 : 0.5
                                    }}
                                    onMouseEnter={() => this.setState({ skinHover: [ false, true, false, false, false ] })}
                                    onMouseLeave={() => this.setState({ skinHover: [ false, false, false, false, false ] })}

                                    onClick={() => this.setState({
                                        skin: "getz",
                                        step: "THIRD"
                                    })}
                                />
                                <img 
                                    src={require("../../resources/skins/madera.png")}
                                    alt="Ебучий анимешник Мадера!"
                                    style={{
                                        ...style.skin,
                                        opacity: this.state.skinHover[2] ? 1 : 0.5
                                    }}
                                    onMouseEnter={() => this.setState({ skinHover: [ false, false, true, false, false ] })}
                                    onMouseLeave={() => this.setState({ skinHover: [ false, false, false, false, false ] })}

                                    onClick={() => this.setState({
                                        skin: "madera",
                                        step: "THIRD"
                                    })}
                                />
                                <img 
                                    src={require("../../resources/skins/oleg.png")}
                                    alt="Олежа мафиозник!"
                                    style={{
                                        ...style.skin,
                                        opacity: this.state.skinHover[3] ? 1 : 0.5
                                    }}
                                    onMouseEnter={() => this.setState({ skinHover: [ false, false, false, true, false ] })}
                                    onMouseLeave={() => this.setState({ skinHover: [ false, false, false, false, false ] })}

                                    onClick={() => this.setState({
                                        skin: "oleg",
                                        step: "THIRD"
                                    })}
                                />
                                <img 
                                    src={require("../../resources/skins/zayka.png")}
                                    alt="Опасная зайка!"
                                    style={{
                                        ...style.skin,
                                        opacity: this.state.skinHover[4] ? 1 : 0.5
                                    }}
                                    onMouseEnter={() => this.setState({ skinHover: [ false, false, false, false, true ] })}
                                    onMouseLeave={() => this.setState({ skinHover: [ false, false, false, false, false ] })}

                                    onClick={() => this.setState({
                                        skin: "zayka",
                                        step: "THIRD"
                                    })}
                                />
                            </div>
                        </center>
                    </div>
                );

            case "THIRD":
                return (
                    <div>
                        <center style={{ marginTop: "10%" }}>
                            <h2>
                                Это ты?
                            </h2>
                            <img 
                                src={require(`../../resources/skins/${this.state.skin}.png`)}
                                alt="Твой прикид, епта!"
                                style={{ width: 300 }}
                            />
                            <br />
                            <b style={{ fontSize: 20 }}> Погоняло: {this.state.name} </b>
                            <div>
                                <Button 
                                    outline 
                                    color="primary"
                                    style={{ marginRight: 10 }}
                                    onClick={() => this.setState({
                                        step: "FOURTH"
                                    })}
                                > 
                                    Погнали
                                </Button>
                                <Button
                                    outline
                                    color="danger"
                                    onClick={() => this.setState({
                                        step: "FIRST",
                                        skinHover: [ false, false, false, false, false ],
                                        name: "",
                                        skin: "",
                                        server: ""
                                    })}
                                >
                                    Фу, бля, снова давай! 
                                </Button>
                            </div> 
                        </center>
                    </div>
                );

            case "FOURTH":
                return (
                    <div>
                        <center style={{ marginTop: "10%" }}>
                            <img 
                                src={require(`../../resources/skins/${this.state.skin}.png`)}
                                alt="Твой прикид, епта!"
                                style={{ width: 200 }}
                            />
                            <br />
                            <b style={{ fontSize: 20 }}> {this.state.name} </b>
                            <br />
                            <br />
                            <h3> Управление: </h3>
                            <p> <b>Стрелки - </b> бегать </p>
                            <p> <b>X - </b> Кинуть кирпич </p>
                            <p> <b>M - </b> Включить/выключить музон (лучше не выключать) </p>
                            <br />
                            <div>
                                <Input
                                    style={{ float: "left", width: "50%", marginTop: 10, marginLeft: "10%", marginRight: 70 }}
                                    placeholder="Куда пойдем? (Вводить адрес сервера, если че)"
                                    onChange={(e) => this.setState({ server: e.target.value })}
                                />
                                <Button
                                    color="primary"
                                    style={{ float: "left", marginTop: 10 }}
                                    onClick={this.checkServer}
                                >
                                    Подключиться, епта!
                                </Button>
                            </div> 
                        </center>
                    </div>
                );
            
            case "GAME":
                return <Game 
                            name={this.state.name}
                            skin={this.state.skin}
                            socket={this.state.connect ? io(`http://${this.state.server}`) : null}
                       />

            default:
                return <p> Error </p>
        }
    }
}
