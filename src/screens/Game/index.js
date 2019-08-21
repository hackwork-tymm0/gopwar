
import React, { Component } from "react";
import { Alert, Progress, Button } from "reactstrap";
import Sound from "react-sound"

import Background from "../../resources/background.jpg"
import CellTexture from "../../resources/cell.jpg";
import _ from "lodash"

const style = {
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        background: `url(${Background})`,
    }
};

function Cell (props) {
    switch (props.type) {
        case "player":
            return (
                <div
                    style={{
                        width: 70,
                        height: 70,
                        background: `url(${CellTexture})`,
                        backgroundSize: 70,
                        float: "left"
                    }}
                >
                    <center>
                        <img 
                            src={require(`../../resources/skins/${props.skin}.png`)}
                            alt={props.name}
                            style={{ width: 50 }}
                        />
                        <p style={{ fontSize: 15 }}> {props.name} </p>
                    </center>
                </div>
            );

            case "attack":
                    return (
                        <div
                            style={{
                                width: 70,
                                height: 70,
                                background: `url(${CellTexture})`,
                                backgroundSize: 70,
                                float: "left"
                            }}
                        >
                            <center>
                                <img 
                                    src={require(`../../resources/brick.png`)}
                                    alt="Кирпичик"
                                    style={{ width: 30, marginTop: 10 }}
                                />
                            </center>
                        </div>
                    );

        default:
            return (
                <div
                    style={{
                        width: 70,
                        height: 70,
                        background: `url(${CellTexture})`,
                        backgroundSize: 70,
                        float: "left"
                    }}
                >
                </div>
            );
    }
}

export default class Game extends Component {
    constructor (props) {
        super();

        props.socket.emit("authorize", { name: props.name, skin: props.skin });

        this.state = {
            step: "GAME",
            map: null,
            loaded: false,
            health: null,
            damageSound: false,
            attackSound: false,
            started: false,
            bgMusic: true
        };
        
        this.drawMap = this.drawMap.bind(this);
    }

    componentWillMount () {

        this.props.socket.on("updateMap", (map) => this.setState({ loaded: true, map: map }));
        this.props.socket.on("attack", () => {
            console.log("attack!!!");
            this.setState({ attackSound: true });
        });
        this.props.socket.on("damageSound", () => {
            console.log("damaged!!!");
            this.setState({ damageSound: true });
        });
        this.props.socket.on("health", (health) => this.state.health !== 0 ? this.setState({ health: health }) : this.props.socket.emit("lose"));
        this.props.socket.on("damage", (name) => {
            if (name === this.props.name) {
                this.props.socket.emit("damage");
            }
        });
        this.props.socket.on("endGame", (loser) => {
            if (loser === this.props.name) {
                this.setState({ step: "LOSE" });
            } else {
                this.setState({ step: "WIN" });
            }
        });
        this.props.socket.on("started", () => {
            this.setState({ started: true });
        });

        window.addEventListener("keyup", (e) => {
            console.log(`key code - ${e.keyCode}`);
            switch (e.keyCode) {
                case 88:
                    this.props.socket.emit("brick");
                break;

                case 77:
                    this.setState({ bgMusic: !this.state.bgMusic });
                break; 

                case 38:
                    this.props.socket.emit("move", "TOP");
                break;

                case 40:
                    this.props.socket.emit("move", "BOTTOM");
                break;
            
                case 37:
                        this.props.socket.emit("move", "LEFT");
                break;

                case 39:
                    this.props.socket.emit("move", "RIGHT");
                break;
            }
        });
    }

    drawMap () {
        return this.state.map.map(row => {
            return <div style={{ marginLeft: 25 }}>
                {row.map(cell => {
                    if (_.isObject(cell)) {
                        return <Cell
                            type="player"
                            name={cell.name}
                            skin={cell.skin}
                        />
                    } else if (cell === "attack") {
                        return <Cell 
                            type="attack"
                        />
                    } else {
                        return <Cell />
                    }
                })}
            </div>
        });
    }

    render () {
        switch (this.state.step) {
            case "WIN":
                this.props.socket.disconnect();

                return (
                    <div>
                        <Sound
                            url={require('../../resources/sounds/win.mp3')}
                            playStatus={Sound.status.PLAYING}
                        />
                        <center style={{ marginTop: "25%" }}>
                            <h1> Ну че, красавчик! </h1>
                            <Button 
                                outline 
                                color="success"
                                style={{ marginRight: 10 }}
                                onClick={() => document.location.reload()}
                            > 
                                АУЕ!
                            </Button>
                        </center>
                    </div>
                );

            case "LOSE":
                this.props.socket.disconnect();

                return (
                    <div>
                        <Sound
                            url={require('../../resources/sounds/lose.mp3')}
                            playStatus={Sound.status.PLAYING}
                        />
                        <center style={{ marginTop: "25%" }}>
                            <h1> Ну ты и лошара конечно! </h1>
                            <Button 
                                outline 
                                color="danger"
                                style={{ marginRight: 10 }}
                                onClick={() => document.location.reload()}
                            > 
                                Пошел ты в жопу!
                            </Button>
                        </center>
                    </div>
                );

            case "GAME":
                console.log(this.state);

                if (this.state.loaded) {
                    return (
                        <div style={style.container}>
                            <Sound
                                url={require('../../resources/sounds/background.mp3')}
                                playStatus={this.state.bgMusic ? "PLAYING" : "PAUSED"}
                                onFinishedPlaying={() => this.setState({ damageSound: false })}
                                volume={50}
                            />

                            <Sound
                                url={require('../../resources/sounds/attack.mp3')}
                                playStatus={this.state.attackSound ? "PLAYING" : "PAUSED"}
                                onFinishedPlaying={() => this.setState({ attackSound: false })}
                            />
                            <Sound
                                url={require('../../resources/sounds/damage.mp3')}
                                playStatus={this.state.damageSound ? "PLAYING" : "PAUSED"}
                                onFinishedPlaying={() => this.setState({ damageSound: false })}
                            />

                            <Alert color={ this.state.started ? "success" : "secondary" }> {this.state.started ? "Мудохайтесь, дебилы!" : "Ждем говноеда...-"} </Alert>
                            <div>
                                {this.drawMap()}
                            </div>
                            <div 
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    position: "absolute",
                                    width: "100%",
                                    marginTop: "55%"
                                }}
                            >
                                <p
                                    style={{
                                        color: "#ffffff",
                                        marginLeft: 25,
                                        marginTop: 20
                                    }}
                                > 
                                    Жызни: {this.state.health}0%
                                </p>
                                <Progress
                                    style={{
                                        marginLeft: 25,
                                        width: "93%",
                                        marginTop: 10
                                    }}
                                    color="danger"
                                    value={`${this.state.health}0`}
                                />
                                <br />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <center style={{ marginTop: "25%" }}>
                                <h1> Загрузка, епта! </h1>
                            </center>
                        </div>
                    );
                }
        }
    }
}
