import React from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
    Dimensions,
    Animated,
} from 'react-native';
import {
    Thumbnail,
    Container,
    Content,
    Header,
    Left,
    Right,
    Title,
    Subtitle,
    Button,
    Body
} from 'native-base';
import {FontAwesome} from '@expo/vector-icons';
import {Location, Permissions} from 'expo';

import MapHeader from './components/MapHeader';
import WhatsAroundMap from './components/WhatsAroundMap'
import ZoomedListing from './components/ZoomedListing'
import WutzAroundHeader from '../../components/WutzAroundHeader'
import Listings from './Listings.json'

const {width, height} = Dimensions.get("window");

const CARD_HEIGHT = height / 4.5;
const CARD_WIDTH = CARD_HEIGHT - 50;

const listings = Listings;

export default class HomeScreen extends React.Component {
    state = {
        region: {
            latitude: 49.247140,
            longitude: -123.064926,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        },
        showItems: false,
        focusedListing: null
    };

    _refMap(map) {
        this.map = map
    }

    _focusListing(listing) {
        this.state.showItems = true;
        this.state.focusedListing = listing;

        this.setState(this.state);
        this._recenterCurrent();
    }

    _closeListing() {
        this.state.showItems = false;
        this.state.focusedListing = null;

        this.setState(this.state);
    }

    _recenterCurrent() {
        this.map.animateToRegion(this.state.focusedListing ? {
            latitude: this.state.focusedListing.latitude,
            longitude: this.state.focusedListing.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        } : this.state.region);
    }

    render() {
        const {navigate} = this.props.navigation;

        let selectListingFacade = {
            refMap : this._refMap.bind(this),
            focusedListing : this.state.focusedListing,
            showItems : this.state.showItems,
            focusListing : this._focusListing.bind(this),
            closeListing : this._closeListing.bind(this),
            recenterCurrent : this._recenterCurrent.bind(this)
        };

        return (
            <Container style={styles.container}>
                {
                    this.state.showItems ?
                        <MapHeader focusedListing={ this.state.focusedListing }/> :
                        <WutzAroundHeader title="WhatsAround"/>
                }
                <View style={{flex: 1}}>
                    <WhatsAroundMap
                        listings={listings}
                        region={this.state.region}
                        selectListingFacade={selectListingFacade}
                    />
                    {
                        /* TODO change products */
                        this.state.showItems &&
                        <ZoomedListing
                            products={listings}
                            navigate={navigate}
                            selectListingFacade={selectListingFacade}
                        />
                    }
                </View>
            </Container>
        )
    }

    _getLocationAsync = async () => {
        let options = {
            enableHighAccuracy: true,
            timeInterval: 3000
        };

        let {status} = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied'
            })
        }

        let location = await Location.getCurrentPositionAsync(options);

        this.setState({location})
    }

}


const styles = {
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {x: 2, y: -2},
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    locationAutocomplete: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },

    pin: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "gray",
        width: 55
    },

    pinImage: {
        width: 50,
        height: 50
    },

    pinThumbnail : {
        position: "absolute",
        left: 7,
        top:2.5,
    },

    pinText: {
        fontSize: 10,
        textAlign: "center"
    },

    recenterText : {
        fontSize: 20,
        fontFamily : "webly-sleek",
        color: "white"
    },

    headerButtons : {
        width: width,
        flexDirection: "row",
        justifyContent: "space-between",
        position:"absolute",
        bottom: height - 180,
    }
};