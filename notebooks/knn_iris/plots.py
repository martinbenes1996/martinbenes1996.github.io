
import matplotlib.pyplot as plt
from matplotlib import collections  as mc
import numpy as np
from scipy import stats
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

def kNN_plot(n_neighbors):
    # fetch data
    iris = load_iris()
    # decompose with PCA
    pca = PCA(n_components=2)
    pca.fit(iris.data)
    iris_data_pca = pca.transform(iris.data)
    # query point
    pt = np.array([-1,.5])#np.array([1.5,0])
    # get n smallest
    d = np.sqrt(((iris_data_pca - pt)**2).sum(axis=1))
    idx = np.argpartition(d, n_neighbors)
    neighbors = iris_data_pca[idx[:n_neighbors]]
    # get label
    pt_target = stats.mode(iris.target[idx[:n_neighbors]]).mode[0]
    pt_label = iris.target_names[pt_target]
    # plot
    fig, ax = plt.subplots()
    for target in np.unique(iris.target):
        i = np.where(target == iris.target)
        ax.scatter(iris_data_pca[i,0], iris_data_pca[i,1], label=iris.target_names[target])
    ax.scatter(*pt, c='black', label='?')
    lines = [[pt, neighbors[i,:]] for i in range(n_neighbors)]
    lc = mc.LineCollection(lines, colors='black', linewidths=2, alpha=.1)
    ax.add_collection(lc)
    ax.set_xlabel('PC1 [%5.3f%%]' % (pca.explained_variance_ratio_[0] * 100))
    ax.set_ylabel('PC2 [%5.3f%%]' % (pca.explained_variance_ratio_[1] * 100))
    ax.legend()
    fig.savefig('notebooks/knn_iris/knn_iris_data/knn_points.png')
    plt.show()
    
    #print(pca.explained_variance_ratio_)

def objective_function(x, type = 'train'):
    iris = load_iris()
    xtrain, xtest, ytrain, ytest = train_test_split(iris.data, iris.target, train_size=.75, random_state=12345)
    knn = KNeighborsClassifier(n_neighbors=int(x))
    knn.fit(xtrain, ytrain)
    if type == 'train':
        return 1 - (knn.predict(xtrain) == ytrain).mean()
    elif type == 'test':
        return 1 - (knn.predict(xtest) == ytest).mean()
    else:
        raise NotImplementedError(f'type {type} not recognized')
    #return np.abs(x - 10) + 4*np.sin(x) + 3

def _plot_objective_function(ax):
    xgrid = np.array(range(1,100))#np.linspace(0,100, 1000)
    fx_train = [objective_function(x,'train') for x in xgrid]
    fx_test = [objective_function(x,'test') for x in xgrid]
    # plot
    ax.plot(xgrid, fx_train, label='Train set')
    ax.plot(xgrid, fx_test, label='Test set')

def plot_grid_search(n = 10, ax = None):
    # create grid
    xgrid = np.linspace(1,100,n)
    fx_train = [objective_function(x,'train') for x in xgrid]
    fx_test = [objective_function(x,'test') for x in xgrid]
    min_idx = np.argmin(fx_test)
    # plot
    if ax is None:
        fig,ax = plt.subplots()
    else:
        fig = None
    _plot_objective_function(ax)
    ax.scatter(xgrid, fx_train)
    ax.scatter(xgrid, fx_test)
    for x in xgrid:
        ax.axvline(x, alpha=.1)
    ax.scatter(xgrid[min_idx], fx_train[min_idx], c='red')
    ax.scatter(xgrid[min_idx], fx_test[min_idx], c='red')
    ax.set_title('Grid search')
    ax.legend()
    if fig is not None:
        fig.savefig('notebooks/knn_iris/knn_iris_data/grid_search.png')

def plot_random_search(n = 10, ax = None):
    # create grid
    np.random.seed(54321)
    xgrid = np.random.uniform(0,100,n)
    fx_train = [objective_function(x,'train') for x in xgrid]
    fx_test = [objective_function(x,'test') for x in xgrid]
    min_idx = np.argmin(fx_test)
    # plot
    if ax is None:
        fig,ax = plt.subplots()
    else:
        fig = None
    _plot_objective_function(ax)
    ax.scatter(xgrid, fx_train)
    ax.scatter(xgrid, fx_test)
    for x in xgrid:
        ax.axvline(x, alpha=.1)
    ax.scatter(xgrid[min_idx], fx_train[min_idx], c='red')
    ax.scatter(xgrid[min_idx], fx_test[min_idx], c='red')
    ax.set_title('Random search')
    ax.legend()
    if fig is not None:
        fig.savefig('notebooks/knn_iris/knn_iris_data/random_search.png')
    
def plot_search():
    # plot
    fig,(ax1,ax2) = plt.subplots(1,2, sharey='row', figsize=(15,5))
    plot_grid_search(ax = ax1)
    plot_random_search(ax = ax2)
    
    ax1.set_xlabel('Hyperparameter value')
    ax2.set_xlabel('Hyperparameter value')
    ax1.set_ylabel('Objective function value')
    fig.savefig('notebooks/knn_iris/knn_iris_data/grid_random.png')
    plt.show()
if __name__ == '__main__':
    #kNN_plot(5)
    plot_search()