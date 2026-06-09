import ProviderLobbyTile from '../game/ProviderLobbyTile';

/** Live Casino lobby tile — delegates to shared ProviderLobbyTile. */
export default function LiveCasinoProviderTile(props) {
    return (
        <ProviderLobbyTile
            favouriteCategory="live-casino"
            navigatePage="live-casino"
            gameProvider="Live Casino"
            {...props}
        />
    );
}
