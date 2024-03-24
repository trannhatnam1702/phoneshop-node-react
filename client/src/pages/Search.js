import React from 'react'
import Layout from '../components/Layout/layout'
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate();
    const [values, setValues] = useSearch();
    return (
        <Layout title={'Search results'}>
            <div className='container'>
                <div className='text-center mt-3'>
                    <h3>Search results</h3>
                    <h6>
                        {values?.results.length < 1 ? 'No Product Found' : `Found ${values?.results.length}`}
                    </h6>
                    <div className='d-flex flex-wrap my-3'>
                        {values?.results.map(p => (
                            <>
                                <div className="card m-2" style={{ width: '18rem' }}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        <p className="card-text">${p.price}</p>
                                        <button class="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details...</button>
                                        <button class="btn btn-secondary ms-1">Add to cart</button>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search
