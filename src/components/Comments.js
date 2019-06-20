import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { receiveUserLogged } from './../actions/users'
import { Row, Button, Col, Card } from 'react-bootstrap'
import { FaRegFrown, FaRegGrin, FaEdit, FaTrash } from 'react-icons/fa'
import { getOnePost } from './../actions/posts'
import { getOnePostIdApi } from './../utils/ApiCalls'
import { receiveAllComments, newComment, deleteComment, saveCommentEdit, voteComment } from './../actions/comments'
import moment from 'moment'
import './../styles/Comments.css'

class Comment extends Component {

  state = {
    newComment: '',
    userLogged: '',
    commentEdited: false,
    commentEditId: '',
    post: {
      author: '',
      body: '',
      category: '',
      commentCount: 0,
      deleted: false,
      id: '',
      timestamp: 0,
      title: '',
      voteScore: 0
    }
  }

  componentDidMount() {
    getOnePostIdApi(this.props.match.params.id)
      .then(post => {
        this.setState({ post })
        this.setState({ contentPost: post.body })
      })
    this.props.receiveAllComments(this.props.match.params.id)
    this.setState({ userLogged: this.props.user.userLogged })
  }

  newCommentState = comment => {
    setTimeout(() => {
      this.setState({ newComment: comment })
    }, 500)
  }

  postNewComment = () => {
    const comment = {
      author: this.state.userLogged,
      body: this.state.newComment,
      deleted: false,
      id: '123456789',
      parentDeleted: false,
      parentId: this.props.match.params.id,
      voteScore: 0
    }

    this.props.newComment(comment)
  }

  removeComment = id => {
    this.props.deleteComment(id)
  }

  editComment = comment => {
    this.setState({ commentEditId: comment.id })
    this.setState({ commentEdit: true })

    document.getElementById('editComment').value = comment.body
  }

  saveEditComment = () => {
    this.props.saveCommentEdit(this.state.commentEditId, this.state.newComment)
    document.getElementById('editComment').value = ''
  }

  voteComment = (id, vote) => {
    this.props.voteComment(id, vote)
  }

  render() {
    return (
      <div>
        <Row className="justify-content-md-center">
          <Card className="cardContentPostDetail">
            <span className="inputEditTitle">
              <b>
                <h4>{this.state.post.title}</h4>
              </b>
            </span>
            <p className="editPostAuthor"><b>Author:</b> <i>{this.state.post.author}</i></p>
            <span>on <i>{moment(this.state.post.timestamp).format('DD/MM/YYYY HH:mm')}</i> in <i>{this.state.post.category}</i></span>
            <Card className="bodyPostDetail">
              {this.state.post.body}
            </Card>
            <br />
            <Row className="justify-content-md-end">
              <span><i>Vote Score:</i> <b>{this.state.post.voteScore}</b> <i>Comment count:</i> <b>{this.state.post.commentCount}</b></span>
            </Row>
          </Card>
        </Row>
        <Row className="justify-content-md-center">
          <div className="cardCommentGeneral">
            {this.props.comments.map(comment => (
              <div key={comment.id} className="cardContentComment">
                <p className="commentBody">{comment.body}</p>
                <p className="commentAuthor"><i>By: <b>{comment.author}</b></i></p>
                <b>On <i>{moment(comment.timestamp).format('DD/MM/YYYY')}</i></b><br />
                <Row>
                  <i className="ml-2 mt-2">Vote Score: <b>{comment.voteScore}</b></i>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Button variant="outline-primary" className="likeButtonComment" onClick={() => this.voteComment(comment.id, 'upVote')}>
                        <FaRegGrin />
                      </Button>
                      <Button variant="outline-danger" onClick={() => this.voteComment(comment.id, 'downVote')} className="deslikeButtonComment">
                        <FaRegFrown />
                      </Button>
                    </Row>
                  </Col>
                  {/* <Col> */}
                  <Button variant="danger" className="mr-1" onClick={() => this.removeComment(comment.id)}>
                    <FaTrash />
                  </Button>
                  {this.state.userLogged === comment.author
                    ? <Button variant="info" onClick={() => this.editComment(comment)}>
                      <FaEdit />
                    </Button>
                    : <Button variant="dark" disabled>
                      <FaEdit />
                    </Button>
                  }
                  {/* </Col> */}
                </Row>
              </div>
            ))}
            <Card className="newComment">
              <textarea className="commentBody" onChange={event => this.newCommentState(event.target.value)} id='editComment' />
              <br />
              <Row className="justify-content-md-end">
                {this.state.commentEdit
                  ? <Button variant="success" onClick={() => this.saveEditComment(this.state.comment)}>Save Comment</Button>
                  : <Button onClick={() => this.postNewComment()}>New Comment</Button>
                }
              </Row>
            </Card>
          </div>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = ({ comments, user }) => ({ comments, user })

const mapDispatchToProps = dispatch => bindActionCreators(
  { receiveAllComments, getOnePost, receiveUserLogged, newComment, deleteComment, saveCommentEdit, voteComment },
  dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Comment)