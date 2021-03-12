import React, {Component} from 'react';
import * as url from "url";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                title: "",
                completed: false,
            },
            editing: false,
        }

        this.fetchTasks = this.fetchTasks.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
    };

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    componentWillMount() {
        this.fetchTasks()
    }

    fetchTasks() {
        console.log('Its working....')
        fetch('http://127.0.0.1:8000/api/list/')
            .then(response => response.json())
            .then(data =>
                this.setState({
                    todoList: data
                })
            )
    }

    handleChange(event) {
        var inputName = event.target.name
        var inputValue = event.target.value
        console.log("Name: ", inputName)
        console.log("Value: ", inputValue)

        this.setState({
            activeItem: {
                ...this.state.activeItem,
                title: inputValue
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log("item: ", this.state.activeItem);
        var csrftoken = this.getCookie('csrftoken');

        var url = 'http://127.0.0.1:8000/api/create/'

        if(this.state.editing === true){
            url = `http://127.0.0.1:8000/api/update/${this.state.activeItem.id}/`
            this.setState({
                editing:false
            })
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(this.state.activeItem)
        }).then((response) => {
            this.fetchTasks()
            this.setState({
                activeItem: {
                    id: null,
                    title: "",
                    completed: false,
                }
            })
        }).catch(function (error) {
            console.log('ERROR: ', error)
        })
    }


    startEdit(task){
        this.setState({
            activeItem:task,
            editing: true,
        })
    }

    deleteItem(task){
        var csrftoken = this.getCookie('csrftoken');
        fetch(`http://127.0.0.1:8000/api/delete/${task.id}/`,{
            method: 'DELETE',
            headers:{
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        }).then((response)=>{
            this.fetchTasks()
        })
    }


    render() {
        var tasks = this.state.todoList;
        var self = this
        return (

            <div className="container p-3 my-3 bg-dark text-white">
                <br/>
                <br/>

                <form onSubmit={this.handleSubmit}>
                    <div className="input-group mb-3">
                        <input onChange={this.handleChange} name="title" value={this.state.activeItem.title} type="text" className="form-control"
                               placeholder="Tasks: create or update..."
                               aria-label="Recipient's username" aria-describedby="button-addon2"/>
                        <input id="button-addon2" type="submit" value="Submit"/>
                    </div>
                </form>


                <div className="container">
                    {tasks.map(function (task, index) {
                        return (
                            <div className="alert alert-primary">
                                <span className="d-flex ">{task.title}</span>

                                <button onClick={()=> self.startEdit(task)} type="button" className="btn btn-primary">Edit</button>
                                <button onClick={()=> self.deleteItem(task)} type="button" className="btn btn-primary">Delete</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default MyComponent;