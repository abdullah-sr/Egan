import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DescriptionIcon from 'material-ui-icons/Description';
import Loader from '../Loader';
import WithAuthorization from '../Session/withAuthorization';
import {db} from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import {convertObjToList} from "../../helpers";
const firebase = require("firebase");

class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            requests: [],
        };
        this.fetchAllRequests = this.fetchAllRequests.bind(this);
    }


    componentDidMount() {
        this.fetchAllRequests();
    }


    fetchAllRequests() {
        let self = this;
        let incRef = db.ref('requests');
        incRef.on('value', function(data) {
            const requests = convertObjToList(data.val());
            requests.reverse();
            self.setState({
                fetching: false,
                requests,
            });
        });
    }

    addListItems(key, site, time) {
        return (
            <Link key={key} to={`/requests/${key}`}>
                <ListItem button>
                    <Avatar>
                        <DescriptionIcon/>
                    </Avatar>
                    <ListItemText primary={site} secondary={time}/>
                </ListItem>
            </Link>
        )

    }

    render() {
        const { classes } = this.props;
        let body = [];
        if(this.state.fetching){
            return <Loader/>;
        }
        for (let i = 0; i < this.state.requests.length; i++) {
            let inc = this.state.requests[i];
            let d = new Date(inc.time);
            let dateTime = d.toLocaleDateString() + " @ " + d.toLocaleTimeString();
            if (inc.status && inc.status == 'open') {
                body.push(this.addListItems(inc.key, inc.site, dateTime));
            }
        }
        return (
            <div className={classes.root}>
                <List>
                    {body}
                </List>
            </div>
        );
    }
}

// IncidentsView.propTypes = {
//     classes: PropTypes.object.isRequired,
// };


const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    textField: {
    },
    button: {
        margin: theme.spacing.unit,
    },
});


const authCondition = (authUser) => !!authUser;
export default WithAuthorization(authCondition)(withStyles(styles)(ChatView));