import * as React from 'react';

import { IProject } from '../interfaces/model';

import { withStyles, Theme } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const drawerWidth = 240;

const styles = (theme: Theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});


interface ISlotListProps {
    project: IProject | undefined;
    vscode: any;
    classes: any;
}

let SlotList = class extends React.Component<ISlotListProps, any> {

    render() {
        const { classes } = this.props;

        const code = `--@slotKey:-2
--@signature:flush()
--@args:
-- compute acceleration and angularAcceleration
local forward =  Nav:composeForwardAcceleration(Nav.thrustManager:getAccelerationCommand())

local angularAcceleration = Nav:composeControlledStabAngularAcceleration(Nav:getRollInput(), Nav:getPitchInput())
                        + Nav:composeTiltingAngularAcceleration()
                        + Nav:composeTurningAngularAcceleration(Nav:getYawInput())

Nav:setEngineCommand("vertical,torque", Nav:composeLiftUpAcceleration(Nav:getLiftInput()), angularAcceleration)
Nav:setEngineCommand("horizontal", forward, nullvector)
Nav:setEngineCommand("brake", Nav:composeBrakingAcceleration(Nav:getBrakeInput()), nullvector)`;

        return (
            <div className={classes.root}>
                <CssBaseline />
                {/* <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Permanent drawer
                        </Typography>
                    </Toolbar>
                </AppBar> */}
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar} />
                    <Divider />
                    <List>
                        {
                            (this.props.project)
                                ? this.props.project.slots.map((slot, index) => (
                                    <ListItem button key={index}>
                                        {index} {slot.name}
                                    </ListItem>
                                ))
                                : null}
                    </List>
                    <Divider />

                </Drawer>
                <main className={classes.content}>
                    {/* <div className={classes.toolbar} /> */}
                    {/* <Typography paragraph> */}

                    <SyntaxHighlighter language='lua'>{code}</SyntaxHighlighter>

                    {/* </Typography> */}
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(SlotList);