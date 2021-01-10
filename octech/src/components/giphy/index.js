import { React, useContext } from 'react'
import { 
    Carousel, // 
    SearchBar, // Search bar that the user will type into.
    SearchContext, // The context that wraps and connects the SearchComponents.
    SearchContextManager // The context manager including the Context.Provider.
} from '@giphy/react-components'
import './index.css'

export default function Giphy({ handleGiffClick }) {
    {/* Giphy apiKey. */}
    const apiKey = "SL07jZg7zFxxOTBN29YaS4979AUIInJK"

    /* Defines the components in a separate function so as to 
       use the context hook. The render props pattern can also be used. */
    const SearchComponents = () => {
        const { fetchGifs, searchKey } = useContext(SearchContext)
        return (
            <>
                <SearchBar placeholder="Search for Giffs or Stickers. Double click to delete added overlays."/>
                <Carousel // Container to display the overlays that the user can use from.
                    key={searchKey}
                    onGifClick={handleGiffClick}
                    fetchGifs={fetchGifs}
                    gifHeight={100}
                    gutter={6}
                />
            </>
        )
    }

    /* The search experience consists of the search manager and its 
       child components that use SearchContext. */
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
