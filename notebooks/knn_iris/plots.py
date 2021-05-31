
import matplotlib.pyplot as plt
from matplotlib import collections  as mc
import numpy as np
from scipy import stats
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA

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
    
    
    ax.set_xlabel('PC1 [%5.3f%%]' % pca.explained_variance_ratio_[0])
    ax.set_ylabel('PC2 [%5.3f%%]' % pca.explained_variance_ratio_[1])
    ax.legend()
    fig.savefig('notebooks/knn_iris/knn_iris_data/knn_points.png')
    plt.show()
    
    #print(pca.explained_variance_ratio_)
    
    
if __name__ == '__main__':
    kNN_plot(5)