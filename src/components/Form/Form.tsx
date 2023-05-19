import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';
import { IGrammarPoint } from '../../Utilities/interfaces';
import { getPrompt } from '../../Utilities/api-calls';
import infoIcon from '../../assets/info_icon.svg';
import Modal from 'react-modal';
import Instructions from '../Instructions/Instructions';

const Form = () => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgAlt, setImgAlt] = useState<string>('')
  const [verb, setVerb] = useState<string>('');
  const [engVerb, setEngVerb] = useState<string>('');
  const [grammarPoints, setGrammarPoints] = useState<IGrammarPoint[]>([]);
  const [sent1, setSent1] = useState<string>('');
  const [sent2, setSent2] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    getPrompt()
      .then(prompt => {
        if (prompt) {
          const promptAttributes = prompt.data.attributes

          setImgUrl(promptAttributes.image_url);
          setImgAlt(promptAttributes.image_alt_text);
          setVerb(promptAttributes.verb);
          setEngVerb(promptAttributes.eng_verb);
          setGrammarPoints(promptAttributes.grammar_points);
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  }, []);

  const openModal: () => void = () => {
    setModalIsOpen(true);
  }

  const closeModal: () => void = () => {
    setModalIsOpen(false);
  }

  return (
    <form>
      <img alt={imgAlt} src={imgUrl} className='prompt-img'/>
      <div className='challenge-container'>
        <div className='challenge-header-container'>
          <img
            className='info-icon'
            src={infoIcon}
            alt='instructions icon'
            onClick={openModal}
          />
          <h2 className='challenge-header'>Challenge</h2>
        </div>
        <div className='prompt-container'>
          <div className='verb-container'>
            <h3 className='prompt-verb'>{verb}</h3>
            <h4 className='prompt-eng-verb'>{engVerb}</h4>
          </div>
          <div className='sentence-container'>
          {grammarPoints.length && <label htmlFor='sent1'>{grammarPoints[0].grammar_point} | {grammarPoints[0].eng_grammar_point}</label>}
            <input
              id='sent1'
              type='text'
              value={sent1}
              placeholder='Enter your sentence'
              onChange={event => setSent1(event.target.value)}
            />
          </div>
          <div className='sentence-container'>
            {grammarPoints.length && <label htmlFor='sent2'>{grammarPoints[1].grammar_point} | {grammarPoints[1].eng_grammar_point}</label>}
            <input
              id='sent2'
              type='text'
              value={sent2}
              placeholder='Enter your sentence'
              onChange={event => setSent2(event.target.value)}
            />
          </div>
        </div>
        {/* Will need to make this route dynamic in the future */}
        <div className='submit-button-container'>
          <Link to={'/Deniz/feedback/1'} className='submit-link'>
            <button className='submit-button'>Submit</button>
          </Link>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Instructions'
      >
        <Instructions />
      </Modal>
    </form>
  );
}

export default Form;