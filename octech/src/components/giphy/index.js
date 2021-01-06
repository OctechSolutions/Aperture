import { React, useContext, useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import ReactGiphySearchbox from 'react-giphy-searchbox'
import { 
    Grid,
    Carousel,
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    SuggestionBar, // an optional UI component that displays trending searches and channel / username results 

} from '@giphy/react-components'
import './index.css'

export default function Giphy() {
    {/* use @giphy/js-fetch-api to fetch gifs */}
    const apiKey = "SL07jZg7zFxxOTBN29YaS4979AUIInJK"
    const gf = new GiphyFetch(apiKey)

    // fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })

    // For width of the grid of giffs.
    const [width, setWidth] = useState(window.innerWidth);

    const handleGiffClick = (gif, e) => {
        console.log("gif", gif);
        e.preventDefault();
    }

    // define the components in a separate function so we can
    // use the context hook. You could also use the render props pattern
    const SearchComponents = () => {
        const { fetchGifs, searchKey } = useContext(SearchContext)
        return (
            <>
                <SearchBar placeholder="Search for Giffs or Stickers."/>
                <Carousel // Container to display giffs in (From Giphy).
                    key={searchKey}
                    onGifClick={handleGiffClick}
                    fetchGifs={fetchGifs}
                    gifHeight={150}
                    gutter={6}
                />
            </>
        )
    }

    // the search experience consists of the manager and its child components that use SearchContext
    const SearchExperience = () => (
        <SearchContextManager apiKey={apiKey}>
            <SearchComponents />
        </SearchContextManager>
    )

    return (
        <div className="giphy">
            {SearchExperience()}   
        </div>
    )
}
