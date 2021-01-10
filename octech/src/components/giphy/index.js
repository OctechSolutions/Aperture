import { React, useContext, useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { 
    Carousel,
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider

} from '@giphy/react-components'
import './index.css'

export default function Giphy({handleGiffClick}) {
    {/* use @giphy/js-fetch-api to fetch gifs */}
    const apiKey = "SL07jZg7zFxxOTBN29YaS4979AUIInJK"

    // define the components in a separate function so we can
    // use the context hook. You could also use the render props pattern
    const SearchComponents = () => {
        const { fetchGifs, searchKey } = useContext(SearchContext)
        return (
            <>
                <SearchBar placeholder="Search for Giffs or Stickers. Double click to delete added overlays."/>
                <Carousel // Container to display giffs in (From Giphy).
                    key={searchKey}
                    onGifClick={handleGiffClick}
                    fetchGifs={fetchGifs}
                    gifHeight={100}
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
