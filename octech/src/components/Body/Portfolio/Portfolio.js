import React from 'react'
import './Portfolio.css'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
}));

export default function Portfolio() {
    const classes = useStyles();
    const tileData = [];
    return (
        <div className={classes.root}>
            <h3>Portfolio!</h3>
            <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {tileData.map((tile) => (
                <GridListTile key={tile.img} cols={tile.cols || 1}>
                <img src={tile.img} alt={tile.title} />
                </GridListTile>
            ))}
            </GridList>
        </div>
    )
}
